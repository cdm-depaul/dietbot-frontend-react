export class API {
  constructor(
    private decoder: TextDecoder = new TextDecoder(),
    private api: string = ''
  ) {}

  public async postData(
    url: string,
    body: string,
    callback: (response: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.api}/${url}`, {
      method: 'Post',
      headers: {
        'content-type': 'application/json',
      },
      body,
    });
    if (response.body) {
      const reader = response.body?.getReader();
      let finish = false;
      while (!finish) {
        const { done: doneReading, value } = await reader.read();
        finish = doneReading;
        if (value !== undefined) {
          const { done, response } = JSON.parse(
            this.decoder.decode(value, { stream: true })
          );
          if (!doneReading) {
            callback(response);
          }
        }
      }
    }
  }
}
