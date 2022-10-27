import * as UpdateConfig from "../../config";
import { Auth } from "../../firebase";
import * as DB from "../../db";
import * as ThemeController from "../../controllers/theme-controller";

export const subgroup: MonkeyTypes.CommandsSubgroup = {
  title: "Custom themes list...",
  // configKey: "customThemeId",
  list: [],
};

const commands: MonkeyTypes.Command[] = [
  {
    id: "setCustomThemeId",
    display: "Custom themes...",
    icon: "fa-palette",
    subgroup,
    beforeSubgroup: (): void => update(),
    available: (): boolean => {
      return !!Auth?.currentUser;
    },
  },
];

export function update(): void {
  if (!Auth?.currentUser) {
    return;
  }

  subgroup.list = [];

  const snapshot = DB.getSnapshot();

  if (!snapshot) return;

  if (snapshot?.customThemes.length === 0) {
    return;
  }
  if (snapshot?.customThemes) {
    for (const theme of snapshot.customThemes) {
      subgroup.list.push({
        id: "setCustomThemeId" + theme._id,
        display: theme.name,
        configValue: theme._id,
        hover: (): void => {
          ThemeController.preview(theme._id, true);
        },
        exec: (): void => {
          // UpdateConfig.setCustomThemeId(theme._id);
          UpdateConfig.setCustomTheme(true);
          ThemeController.set(theme._id, true);
        },
      });
    }
  }
}

export default commands;
