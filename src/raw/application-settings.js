export default {
  'name': 'appsettings',
  'type': 'Microsoft.Web/sites/config',
  'location': 'South Central US',
  'properties': {
    'LOREM': 'q2',
    'EmailConnector:SendEmail:AzureServiceBus:QueueConnectionString': 'Endpoinsb://asd',
    'EmailConnector:SmtpHost': 'smpt.office365.com',
    'EmailConnector.SmtpHostPort': '1111',
  },
}
