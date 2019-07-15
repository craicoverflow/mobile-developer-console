import { CustomResource } from './customresource';
import { KeycloakRealmCR } from './keycloakrealmcr';
import { PushVariantCR } from './pushvariantcr';
import { MetricsCR } from './appmetricsconfigcr';
import { DataSyncCR } from './datasync';
import { MobileSecurityServiceAppCR } from './mobilesecurityserviceappcr';

/**
 * Produce an instance of a custom resouce based on the passed in data.
 * For now it always return an instance of the base CustomResource class, but it can be easily changed to return subclasses.
 * @param {*} data
 */
export function newCustomResource(serviceInfo, data) {
  if (serviceInfo.type === 'keycloak') {
    return new KeycloakRealmCR(data);
  }
  if (serviceInfo.type === 'sync-app') {
    return new DataSyncCR(data);
  }
  // TODO: use the right kind
  if (serviceInfo.type === 'push') {
    return new PushVariantCR(data);
  }
  if (serviceInfo.type === 'metrics') {
    return new MetricsCR(data);
  }
  if (serviceInfo.type === 'security') {
    return new MobileSecurityServiceAppCR(data);
  }
  return new CustomResource(data);
}

export function newCustomResourceClass(serviceInfo) {
  if (serviceInfo.type === 'keycloak') {
    return KeycloakRealmCR;
  }
  if (serviceInfo.type === 'sync-app') {
    return DataSyncCR;
  }
  if (serviceInfo.type === 'push') {
    return PushVariantCR;
  }
  if (serviceInfo.type === 'metrics') {
    return MetricsCR;
  }
  if (serviceInfo.type === 'security') {
    return MobileSecurityServiceAppCR;
  }
  return CustomResource;
}
