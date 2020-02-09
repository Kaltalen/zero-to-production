import { IExample } from '@uqt/examples/data-access';

export const EXAMPLES: IExample[] = [
  // The Dynamic Form Component must be the first example to align with the lazy load modules
  // If this changes, ensure to correct the that component as well
  {
    id: '1',
    title: 'Dynamic Form Component',
    summary:
      'Create a dynamic form component to remove the pain from using angular form.',
    description:
      'With the amount of boiler plate required to use forms in Angular, they ' +
      'can become tedious quickly. Creating and using a dynamic form component ' +
      'application wide can significantly simplify forms and help standardize styling, ' +
      'validation, animations etc.',
    url: 'dynamic-form'
  },
  {
    id: '2',
    title: 'Drag & Drop Form Builder',
    summary: 'A Drag & Drop form builder for user creatable forms.',
    description:
      'Building on the Dynamic Form Component, an example of a Drag & Drop Form ' +
      'Builder to allow users to build their own structure (to use with the dynamic form component).',
    url: 'form-builder'
  },
  {
    id: '3',
    title: 'Themeing with CSS Variables',
    summary: 'Using CSS Variables to create a user configurable theme.',
    description:
      'Combing CSS Variables along with a Theming Service to create a user ' +
      'configurable them.',
    url: 'theming'
  },
  {
    id: '4',
    title: 'Lazy Load Scrolling',
    summary: 'A scrolling strategy to manually lazy load feature modules.',
    description:
      'It is common practice to lazy load modules as child routes, but there are more ' +
      'ways to benefit from code splitting. Scrolling is just one example of how to ' +
      'manually load modules.',
    url: 'lazy-scroll'
  },
  {
    id: '5',
    title: 'Todo App (with Auth)',
    summary: 'A demo of the versatility of a well structured Monorepo.',
    description:
      'We have all seen a Todo App before but this demonstrates how a well structured monorepo ' +
      'can make your code highly reusable.',
    url: 'secure'
  },
  {
    id: '6',
    title: 'Start Your Own Monorepo',
    summary:
      'Clone, build, deploy! Make this repo the start of your own project.',
    description:
      'Follow the instructions listed below to make this repo the beginning of your own project.',
    url: 'make-it-your-own'
  }
];