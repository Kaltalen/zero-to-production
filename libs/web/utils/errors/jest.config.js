module.exports = {
  name: 'frontend-common-utils-errors',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/web/utils/errors',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
