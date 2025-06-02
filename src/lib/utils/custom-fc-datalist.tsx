/* eslint-disable @typescript-eslint/ban-ts-comment */

export const customFcDatalist = {
  // TODO: Implementar tipagem correta para o item
  RELATED: (item: unknown) => {
    // @ts-ignore
    if (item?.federation) {
      // @ts-ignore
      return item.federation.name! as string;
    }

    // @ts-ignore
    if (item.team) {
      // @ts-ignore
      return item.team.name! as string;
    }

    return 'CBHG';
  }
};