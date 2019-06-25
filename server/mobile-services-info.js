const url = require('url');

const PUSH_SERVIE_TYPE = 'push';
const IDM_SERVICE_TYPE = 'keycloak';
const METRICS_SERVICE_TYPE = 'metrics';
const DATA_SYNC_TYPE = 'sync-app';
const DEVICE_SECURITY_TYPE = 'security';

function decodeBase64(encoded) {
  const buff = Buffer.from(encoded, 'base64');
  return buff.toString('utf8');
}

const PushService = {
  type: PUSH_SERVIE_TYPE,
  name: 'Push Notification',
  icon: '/img/push.svg',
  description: 'Unified Push Server',
  bindCustomResource: {
    name: 'pushvariants',
    version: 'v1alpha1',
    group: 'aerogear.org',
    kind: 'PushVariant'
  },
  getClientConfig: (namespace, appname, kubeclient) =>
    // TODO: implement me!
    null
};

const IdentityManagementService = {
  type: IDM_SERVICE_TYPE,
  name: 'Identity Management',
  icon: '/img/keycloak.svg',
  description: 'Identity Management Service',
  bindCustomResource: {
    name: 'keycloakrealms',
    version: 'v1alpha1',
    group: 'aerogear.org',
    kind: 'KeycloakRealm'
  },
  getClientConfig: (namespace, appname, kubeclient) => {
    const secretName = `${appname}-client-install-config`;
    return kubeclient.api.v1
      .namespaces(namespace)
      .secrets(secretName)
      .get()
      .then(resp => resp.body)
      .then(secret => {
        if (secret) {
          const encodedInstall = secret.data.install;
          const config = JSON.parse(decodeBase64(encodedInstall));
          return {
            id: secret.metadata.uid,
            name: IDM_SERVICE_TYPE,
            type: IDM_SERVICE_TYPE,
            url: config['auth-server-url'],
            config
          };
        }
        return null;
      })
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find secret ${secretName}`);
        } else {
          console.warn(`Error when fetch secret ${secretName}`, err);
        }
        return null;
      });
  }
};

const MetricsService = {
  type: METRICS_SERVICE_TYPE,
  name: 'Mobile App Metrics',
  icon: '/img/metrics.svg',
  description: 'Mobile App Metrics Service',
  bindCustomResource: {
    name: 'metricsapps',
    version: 'v1alpha1',
    group: 'aerogear.org',
    kind: 'MetricsApp'
  },
  getClientConfig: (namespace, appname, kubeclient) =>
    // TODO: implement me!
    null
};

const DataSyncService = {
  type: DATA_SYNC_TYPE,
  name: 'Data Sync',
  icon: '/img/sync.svg',
  description: 'Data Sync',
  bindCustomResource: {
    name: 'configmaps',
    version: 'v1',
    kind: 'ConfigMap'
  },
  getClientConfig: (namespace, appname, kubeclient) => {
    const configmapName = `${appname}-data-sync-binding`;
    return kubeclient.api.v1
      .namespaces(namespace)
      .configmaps(configmapName)
      .get()
      .then(resp => resp.body)
      .then(configmap => {
        if (configmap) {
          const serverUrl = url.parse(configmap.data.syncServerUrl);
          serverUrl.pathname = configmap.data.graphqlEndpoint;
          const httpUrl = url.format(serverUrl);
          serverUrl.protocol = 'wss';
          const websocketUrl = url.format(serverUrl);
          return {
            id: configmap.metadata.uid,
            name: DATA_SYNC_TYPE,
            type: DATA_SYNC_TYPE,
            url: httpUrl,
            config: {
              websocketUrl
            }
          };
        }
        return null;
      })
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find configmap ${configmapName}`);
        } else {
          console.warn(`Error when fetch configmap ${configmapName}`, err);
        }
        return null;
      });
  }
};

const mssAppsNamespace = process.env.MSS_APPS_NAMESPACE || process.env.MSS_NAMESPACE;

const DeviceSecurityService = {
  type: DEVICE_SECURITY_TYPE,
  name: 'Device Security',
  disabled: true,
  icon: '/img/security.svg',
  description: 'Device Security',
  bindCustomResource: {
    name: 'configmaps',
    version: 'v1',
    kind: 'ConfigMap'
  },
  getClientConfig: (_, appname, kubeclient) => {
    if (!mssAppsNamespace) {
      return null;
    }

    const configmapName = `${appname}-security`;

    return kubeclient.api.v1
      .namespaces(mssAppsNamespace)
      .configmaps(configmapName)
      .get()
      .then(resp => resp.body)
      .then(configmap => {
        if (configmap) {
          const sdkConfig = JSON.parse(configmap.data.SDKConfig);
          return {
            id: configmap.metadata.uid,
            name: DEVICE_SECURITY_TYPE,
            type: DEVICE_SECURITY_TYPE,
            url: url.format(sdkConfig.url)
          };
        }
        return null;
      })
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find configmap ${configmapName}`);
        } else {
          console.warn(`Error when fetch configmap ${configmapName}`, err);
        }
        return null;
      });
  }
};

const MobileServicesMap = {
  [PUSH_SERVIE_TYPE]: PushService,
  [IDM_SERVICE_TYPE]: IdentityManagementService,
  [METRICS_SERVICE_TYPE]: MetricsService,
  [DATA_SYNC_TYPE]: DataSyncService,
  [DEVICE_SECURITY_TYPE]: DeviceSecurityService
};

module.exports = {
  MobileServicesMap,
  PushService,
  IdentityManagementService,
  DataSyncService,
  MetricsService,
  DeviceSecurityService
};
