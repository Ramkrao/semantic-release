const semver = require('semver');
const {FIRST_RELEASE} = require('./definitions/constants');

module.exports = ({nextRelease: {type}, lastRelease, branch, logger}) => {
  let version;
  console.log(`Last branch version is ${lastRelease.version}`)
  console.log(`Computing the next release version for the branch ${branch} with type ${type}`)
  if (lastRelease.version) {
    //version = semver.inc(lastRelease.version, type);
    switch (branch) {
      case 'develop':
        version = semver.inc(lastRelease.version, type, "dev");
        break;
      case 'master':
        version = semver.inc(lastRelease.version, "pre");
        let parsed = semver.parse(version);
        let index = 1;
        if (parsed.prerelease.length === 1)
          index = 0;
        version = `${semver.coerce(version)}-${parsed.prerelease[index]}`;
        break;
      case 'feature':
        version = semver.inc(lastRelease.version, "pre", "SNAPSHOT");
        break;
      case 'release':
        version = semver.inc(lastRelease.version, "pre", 'rc');
        break;
      case 'bugfix':
        version = semver.inc(lastRelease.version, "pre", 'bugfix');
        break;
    }
    logger.log(`The next release version is ${version}`);
  } else {
    version = FIRST_RELEASE;
    logger.log(`There is no previous release, the next release version is ${version}`);
  }

  return version;
};
