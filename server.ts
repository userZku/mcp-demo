import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import http from "http";
import fs from "fs/promises";
import path from "path";

const httpServer = http.createServer(async (req, res) => {
  if (req.url === "/mcp") {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const server = new McpServer({ name: "demo-server", version: "1.0.0" });

    server.registerTool(
      "get_time",
      {
        description: "Retourne la date et l'heure actuelles du système",
      },
      async () => ({
        content: [{ type: "text", text: `Il est : ${new Date().toLocaleString("fr-FR")}` }],
      })
    );

    server.registerTool(
      "add",
      {
        description: "Additionne deux nombres",
        inputSchema: { a: z.number(), b: z.number() },
      },
      async ({ a, b }) => ({
        content: [{ type: "text", text: `${a} + ${b} = ${a + b}` }],
      })
    );

    server.registerTool(
        "read_file",
        {
            description: "Lit le contenu d'un fichier texte sur le disque. À utiliser quand l'utilisateur veut lire, consulter ou analyser un fichier.",
            inputSchema: {
            filepath: z.string().describe("Chemin absolu ou relatif vers le fichier à lire"),
            },
        },
        async ({ filepath }) => {
            try {
            const resolvedPath = path.resolve(filepath);
            const content = await fs.readFile(resolvedPath, "utf-8");
            return {
                content: [{ type: "text", text: content }],
            };
            } catch (err: any) {
            return {
                content: [{ type: "text", text: `Erreur : impossible de lire "${filepath}" — ${err.message}` }],
                isError: true,
            };
            }
        }
    );

    server.registerTool(
        "get_weather",
        {
            description: "Retourne la météo actuelle d'une ville. À utiliser quand l'utilisateur demande la météo, la température, ou les conditions climatiques d'un endroit.",
            inputSchema: {
            city: z.string().describe("Le nom de la ville, ex: 'Bruxelles', 'Paris', 'London'"),
            },
        },
        async ({ city }) => {
            try {
            // Étape 1 : convertir le nom de la ville en coordonnées GPS (API gratuite, sans clé)
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`;
            
            const geoBody = await fetch(geoUrl).then((r) => r.json()) as any;

            if (!geoBody.results?.length) {
                return {
                content: [{ type: "text", text: `Ville introuvable : "${city}"` }],
                isError: true,
                };
            }

            const { latitude, longitude, name, country } = geoBody.results[0];

            // Étape 2 : récupérer la météo avec les coordonnées
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m&timezone=auto`;

            const weatherBody = await fetch(weatherUrl).then((r) => r.json()) as any;
            const c = weatherBody.current;

            // Traduction des codes météo open-meteo
            const weatherDesc: Record<number, string> = {
                0: "Ciel dégagé", 1: "Principalement dégagé", 2: "Partiellement nuageux",
                3: "Couvert", 45: "Brouillard", 48: "Brouillard givrant",
                51: "Bruine légère", 53: "Bruine modérée", 55: "Bruine dense",
                61: "Pluie légère", 63: "Pluie modérée", 65: "Pluie forte",
                71: "Neige légère", 73: "Neige modérée", 75: "Neige forte",
                80: "Averses légères", 81: "Averses modérées", 82: "Averses violentes",
                95: "Orage", 96: "Orage avec grêle", 99: "Orage avec grêle forte",
            };

            const desc = weatherDesc[c.weathercode] ?? "Conditions inconnues";

            const text = [
                `Météo à ${name} (${country}) :`,
                `• Conditions : ${desc}`,
                `• Température : ${c.temperature_2m}°C (ressentie ${c.apparent_temperature}°C)`,
                `• Humidité : ${c.relativehumidity_2m}%`,
                `• Vent : ${c.windspeed_10m} km/h`,
            ].join("\n");

            return {
                content: [{ type: "text", text }],
            };
            } catch (err: any) {
            return {
                content: [{ type: "text", text: `Erreur météo : ${err.message}` }],
                isError: true,
            };
            }
        }
    );

    server.registerTool(
        "write_file",
        {
            description: "Écrit ou écrase un fichier texte sur le disque. À utiliser quand l'utilisateur veut sauvegarder, créer ou modifier un fichier.",
            inputSchema: {
            filepath: z.string().describe("Chemin absolu ou relatif vers le fichier à écrire"),
            content: z.string().describe("Le contenu à écrire dans le fichier"),
            append: z.boolean().optional().describe("Si true, ajoute à la fin du fichier au lieu d'écraser. Défaut : false"),
            },
        },
        async ({ filepath, content, append = false }) => {
            try {
            const resolvedPath = path.resolve(filepath);

            // Crée les dossiers intermédiaires si nécessaire
            await fs.mkdir(path.dirname(resolvedPath), { recursive: true });

            if (append) {
                await fs.appendFile(resolvedPath, content, "utf-8");
            } else {
                await fs.writeFile(resolvedPath, content, "utf-8");
            }

            const action = append ? "ajouté au" : "écrit dans";
            return {
                content: [{ type: "text", text: `Contenu ${action} fichier : ${resolvedPath}` }],
            };
            } catch (err: any) {
            return {
                content: [{ type: "text", text: `Erreur : impossible d'écrire "${filepath}" — ${err.message}` }],
                isError: true,
            };
            }
        }
    );

    await server.connect(transport);
    await transport.handleRequest(req, res);
  } else {
    res.writeHead(404).end();
  }
});

httpServer.listen(3001, () => {
  console.log("Serveur MCP démarré sur http://localhost:3001/mcp");
});