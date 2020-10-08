export async function fetchStats(): Promise<
    | {
          guilds: number;
          users: number;
      }
    | undefined
> {
    const response = await fetch('/api/stats');
    if (response.status == 200) {
        return await response.json();
    }
    return undefined;
}
