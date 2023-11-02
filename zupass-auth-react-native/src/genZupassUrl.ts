export function genZupassUrl({
  returnUrl,
  remoteUrl,
  title,
  description = '',
}: {
  /**
   * The URL that Zupass will redirect to after the user has completed the proof.
   */
  returnUrl: string
  /**
   * The URL of the remote server that will be used to fetch the group information.
   */
  remoteUrl: string
  /**
   * The title show to the user during the proof request.
   */
  title: string
  /**
   * Doesn't seem to be used anywhere.
   */
  description?: string
}) {
  const requestParamValue = {
    type: 'Get',
    returnUrl,
    args: {
      externalNullifier: {
        argumentType: 'BigInt',
        userProvided: false,
        value: '0',
      },
      group: {
        argumentType: 'Object',
        userProvided: false,
        remoteUrl,
      },
      identity: {
        argumentType: 'PCD',
        pcdType: 'semaphore-identity-pcd',
        userProvided: true,
      },
      signal: {
        argumentType: 'BigInt',
        userProvided: false,
        value: '0',
      },
    },
    pcdType: 'semaphore-group-signal',
    options: {
      title,
      description,
    },
  }

  const search = `request=${encodeURIComponent(JSON.stringify(requestParamValue))}`
  return `https://zupass.org/#/prove?${search}`
}
