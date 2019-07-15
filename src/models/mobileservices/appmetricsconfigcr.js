import { CustomResource } from './customresource';

export class MetricsCR extends CustomResource {
  // eslint-disable-next-line class-methods-use-this
  isReady() {
    return true;
  }

  getConfiguration(url) {
    const grafanaUrl = this.spec.get('grafanaUrl');
    return [
      { type: 'href', label: 'Metrics Endpoint', value: url },
      {
        type: 'href',
        label: 'Grafana URL',
        value: grafanaUrl
      }
    ];
  }

  static bindForm(params) {
    return {
      schema: {
        additionalProperties: false,
        properties: {
          CLIENT_ID: {
            title: 'Mobile Client ID',
            type: 'string',
            default: params.appName
          }
        },
        type: 'object'
      },
      uiSchema: {
        CLIENT_ID: {
          'ui:readonly': true
        }
      }
    };
  }

  static newInstance({ CLIENT_ID }) {
    // TODO: implement me
    return {
      apiVersion: 'metrics.aerogear.org/v1alpha1',
      kind: 'AppMetricsConfig',
      metadata: {
        name: `${CLIENT_ID}`,
        labels: {
          'mobile.aerogear.org/client': CLIENT_ID
        }
      }
    };
  }

  static getDocumentationUrl() {
    return 'https://docs.aerogear.org/external/apb/metrics.html';
  }
}
