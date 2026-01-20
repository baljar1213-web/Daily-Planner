import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.tasks.list.path, async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask(input);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  app.patch(api.tasks.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.tasks.update.input.parse(req.body);
      const updated = await storage.updateTask(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  app.delete(api.tasks.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteTask(id);
    res.status(204).send();
  });

  // Seed data if empty
  const existingTasks = await storage.getTasks();
  if (existingTasks.length === 0) {
    await storage.createTask({ text: "Plan my day", completed: true });
    await storage.createTask({ text: "Drink water", completed: false });
    await storage.createTask({ text: "Read a book", completed: false });
  }

  return httpServer;
}
