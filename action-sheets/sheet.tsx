import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
// import ExampleSheet from "./example-sheet";
import CreateHabit from "./create-habit";
// import ExampleSheet from "./ExampleSheet";

// registerSheet("example-sheet", ExampleSheet);
registerSheet("create-habit", CreateHabit);

// Extend types for better intellisense
declare module "react-native-actions-sheet" {
  interface Sheets {
    // "example-sheet": SheetDefinition;
    "create-habit": SheetDefinition;
  }
}
