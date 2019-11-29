// @flow

const updateVersion = (obj: Object, dependencyType: string, dependencyKey: string, version: string) => {
  const pkgConfig = {...obj};
  if (pkgConfig[dependencyType] && pkgConfig[dependencyType][dependencyKey]) {
    pkgConfig[dependencyType][dependencyKey] = version;
  }

  return pkgConfig;
};

module.exports = updateVersion;
