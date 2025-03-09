import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import { supabase } from "@/utils/SupaLegend";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

// Define Habit Type
type Habit = {
  id: string;
  user_id: string;
  habitName: string;
  category: string;
  reminderTime: string;
  frequency: number[];
  notificationEnable: boolean;
  habitColor: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
};

// Function to Open Database
let db: SQLite.SQLiteDatabase | null = null;

const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("habitTracker.db");
  }
  return db;
};

// Initialize the Database
export const setupDatabase = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      habit_name TEXT NOT NULL,
      category TEXT NOT NULL,
      reminder_time TEXT NOT NULL,
      frequency TEXT NOT NULL,
      notification_enable BOOLEAN NOT NULL DEFAULT 1,
      habit_color TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );
  `);
};

// Insert Habit Locally
export const insertHabit = async (habit: Omit<Habit, "synced">) => {
  const db = await openDatabase();
  const habitId = habit.id || Crypto.randomUUID();
  const user_id = await SecureStore.getItemAsync("accessToken");
  await db.runAsync(
    `INSERT INTO habits (id, user_id, habit_name, category, reminder_time, frequency, notification_enable, habit_color, synced) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      habitId,
      user_id,
      habit.habitName,
      habit.category,
      habit.reminderTime,
      JSON.stringify(habit.frequency),
      habit.notificationEnable ? 1 : 0,
      habit.habitColor,
      0, // Not synced
    ]
  );
  NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      syncHabitsToSupabase();
    }
  });
};

// Fetch Habits (Offline)
export const getHabits = async (): Promise<Habit[]> => {
  const db = await openDatabase();
  const results = await db.getAllAsync("SELECT * FROM habits");
  return results.map((row: any) => ({
    ...row,
    frequency: JSON.parse(row.frequency),
    notification_enable: row.notification_enable === 1,
  }));
};

// Update Habit
export const updateHabit = async (id: string, updates: Partial<Habit>) => {
  const db = await openDatabase();
  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updates).map((value) =>
    Array.isArray(value) ? JSON.stringify(value) : value
  );
  values.push(id);

  await db.runAsync(
    `UPDATE habits SET ${fields}, updated_at = datetime('now') WHERE id = ?`,
    values
  );
};

// Delete Habit
export const deleteHabit = async (id: string) => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM habits WHERE id = ?", [id]);
};

// Sync Local Data to Supabase
export const syncHabitsToSupabase = async () => {
  const db = await openDatabase();
  const unsyncedHabits = await db.getAllAsync(
    "SELECT * FROM habits WHERE synced = 0"
  );

  if (unsyncedHabits.length === 0) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("habit").upsert(
    unsyncedHabits.map((habit: any) => ({
      id: habit.id,
      user_id: user?.id,
      habit_name: habit.habit_name,
      category: habit.category,
      reminder_time: habit.reminder_time,
      frequency: JSON.parse(habit.frequency),
      notification_enable: habit.notification_enable === 1,
      habit_color: habit.habit_color,
      created_at: habit.created_at,
      updated_at: habit.updated_at,
    }))
  );

  if (!error) {
    await db.runAsync("UPDATE habits SET synced = 1 WHERE synced = 0");
  } else {
    console.error("Sync error:", error);
  }
};

// Auto Sync When Online
NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    syncHabitsToSupabase();
  }
});

// Export all functions
export default {
  setupDatabase,
  insertHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  syncHabitsToSupabase,
};
