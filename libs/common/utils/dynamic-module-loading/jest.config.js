module.exports = {
  name: 'common-utils-dynamic-module-loading',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/libs/common/utils/dynamic-module-loading',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};