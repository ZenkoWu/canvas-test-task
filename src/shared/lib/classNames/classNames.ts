type Mods = Record<string, boolean | string | undefined>;

export const classNames = (
  cls: string,
  mods: Mods = {},
  additional: string[] = []
): string => {
  const arrayMods = [
    cls,
    ...additional.filter(Boolean),
    ...Object.entries(mods)
      .filter(([_, value]) => value !== undefined && Boolean(value))
      .map(([cls]) => cls),
  ].join(" ");

  return arrayMods;
};
