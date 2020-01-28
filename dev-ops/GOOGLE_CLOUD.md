# Deploy your API Server in Google Cloud Kubernetes

## Before you Start

- Make sure to have [Google Cloud SDK](https://cloud.google.com/sdk) and [Kubernetes CLI](https://kubernetes.io/docs/reference/kubectl/) installed.

- You will need a Mongo DB for your the API to connect to. This is entirely up to you how/where you would like to host your DB but Mongo Atlas has a free tear that you can test with. Follow the instructions on [their website](https://www.mongodb.com/cloud/atlas) to get up and running.

  - For initial setup, allow connections from all IP Addresses. This will later be configured to use a VPC Network to only whitelist the Kubernetes Cluster IP's.
  - When creating your first cluster on Mongo Atlas, once your cluster is up an running, click **collections** and create a database (remember the name) and the first collection i.e. the `users` collection.
  - When you click **conect** -> **connect your application** and get your connection string, by default

- An RS256 Private Key is required for singing your JWT access tokens. Depending on the Authentication Guard setup (see the [API Authentication Library](../libs/backend/auth/README.md)) you may or may not need the Public Key for Verifying the JWT. As the API is currently set up, the public key is auto generated from the private key at startup and served as a [JSON Web Key Set (JWKS)](https://tools.ietf.org/html/rfc7517) at the url `/.well-know/jwks.json`. See [Auth 0](https://auth0.com/docs/tokens/concepts/jwks) for further explanation and rational behind a JWKS.  
  There is a helper script in `tools/scripts/bin/generate-rsa.js` to generate an RSA256 Private Key (pkcs8).

- To work through to completion you will need a domain name. For this example the domain name will be `zero-to-production.dev` and we will host our API server at the subdomain `api.zero-to-production.dev`

## Google Cloud - Build Trigger

As we are deploying our cluster on Google Cloud, we can make the most of the tools available and setup a cloud trigger to auto build our `Docker` image for us.

A `Dockerfile` to build our API project from the source files is provided at `docker/api.Dockerfile`. Please see the [README](../docker/README.md) for further details.

NOTE: The image name that you build and push to the Google Cloud Registry here is the image you will uses in you Kubernestes cluster. The image name should follow \<registry>/\<cloud-project-name>/\<image-name>

1. On Google Cloud, go to **Tools** -> **Cloud Build**.
2. Follow the steps to connect you **`Git`** repo.
3. Once your repo is authenticated, create a _Push Trigger_ by following the instructions. **Note**: It is entirely up to you what rules you configure (branch, tag etc.), but be mindful this is a Monorepo and not all commits should re-trigger the build.

   - When selecting the `Build Configuration`, select the `Cloud Build Configuration File` and point it at `/dev-ops/cloudbuild.yaml`
   - The build file is set up to use _substitutions_ for the image name and the source directory of the project. For this example, the **\_IMAGE_NAME** and **\_PROJECT_DIRECTORY** variables must be set.

     For this example site:  
     **\_IMAGE_NAME**: `gcr.io/zero-to-production/z2p-api`  
     **\_PROJECT_DIRECTORY**: `apps/backend/api`

4. Manually trigger the build to test the build runs and your container image is visible in the **Container Registry**

## Google Cloud - Kubernetes Cluster

1. Reserve a Static IP address to allow the load balancer to auto create forwarding rules. **VPC Network** -> **External IP Address** -> **Reserve Static IP**. Name your IP to whatever you want.
2. Create a new Kubernetes Cluster. **Kuberetes Engine** -> **Clusters** -> **Create Cluster** and follow the guides as necessary. If testing then use the preset 'My first cluster'. Once up and running connect to your cluster.
3. Once connected, first thing is to apply all configuration and secrets to the cluster that the containers may require. For this setup all required setup files are located in the `config/` directory.

   - `config.yaml`: Contains non sensitive information and is `ConfigMap` resource.
   - `secrets.yaml` (**Configure**): A `Secret` resource that contains all sensitive information. All values here must be base64 encoded strings. **DO NOT COMMIT THIS INTO SOURCE CONTROL**. Rename `example.secrets.yaml` to `secrets.yaml` and uncomment and replace the PLACEHOLDER entries with your respective entries. **CHANGES REQUIRED**
   - The `backend-config.yaml` is a `BackendConfig` resource to change the default timeout for all connections. This is required for WebSocket connections, with a possible maximum time of 24 hours. **NO CHANGES REQUIRED**
   - `gcl-managed-certificate.yaml` configures a Google Managed Certificate for SSL/TLS for our domain. Here you configure the name of the managed cert and the domain name to associated with the certificate.
   - `traefik-cluster-role.yaml`: Role-based access control for [Traefik](https://docs.traefik.io/), the reverse proxy sitting between the Google Cloud L7 global load balancer and your application containers.
   - `traefik-config.yaml` is the `.toml` configuration for Traefik

   Apply all configuration files by running:

   ```bash
   kubectl apply -f dev-ops/kubernetes/config/
   ```

4. Configure all the Deployment & Ingress specs

   - `traefik-deployment.yaml` : No changes required.
   - `google-load-balancer-ingress.yaml`: Set the name of the **static ip** and **managed certificate resource** respectively.
   - `z2p-api-deployment.yaml`: Change the container image to your respective image. Optionally (and highly recommended), change all deployment, service and file names to your choosing (i.e. `z2p-api-service` to `your-chosen-service-name`)
   - `fannout-ingress.yaml`: Change the host name and service name/port to your own respective values.

5. Apply all deployments and ingress resources to the cluster

   ```bash
   kubectl apply -f dev-ops/kubernetes/
   ```

   You can view your Deployments and Ingress resources under **Kubernetes Engine** -> **Workloads/Services & Ingress**

## Configure Your DNS Provider

To access your cluster via your domain name, e.g. `api.zero-to-production.dev` you will have to configure your DNS records with your domain name provider. Assuming you are hosting your API at the subdomain `api.`, then create an A record (or AAAA if using IPv6) that directs your subdomain to the IP address. This will take time to update (up to 24 hours). Once updated, test your cluster is running correctly by visiting you `https://api.your-domain.com/healthz` (this is the readiness probe route). You should receive status 200 OK response back

## Create VPC Network (if using Mongo Atlas)

1. In mongo atlas

### Notes

- In the Global Load Balancer config, `HTTP` traffic has been disabled so you can only access your cluster via `HTTPS`.