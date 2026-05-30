# Lernpfad Innenwinkelsumme im Dreieck

## Nutzung mit GitHub Pages

1. Neues Repository erstellen, z. B. `innenwinkelsumme-dreieck`.
2. Die Datei `index.html` aus diesem Ordner in das Repository hochladen.
3. In GitHub `Settings → Pages` öffnen.
4. `Deploy from a branch` auswählen.
5. Branch `main` und Ordner `/root` wählen.
6. Speichern und die angezeigte GitHub-Pages-URL öffnen.

## KaTeX-Hinweis

Die Formeln werden beim Laden der Seite mit KaTeX gerendert. In dieser Version ist die KaTeX-Initialisierung vor alle anderen Skriptaufrufe gesetzt, sodass auch eine gespeicherte Unterseite aus `localStorage` beim Laden keine Rendering-Funktion vorzeitig aufruft.

Falls Formeln trotzdem als LaTeX-Code sichtbar bleiben, blockiert vermutlich das Netzwerk den Zugriff auf die KaTeX-CDNs. Dann die Seite in einem anderen Netzwerk testen oder KaTeX lokal im Repository ablegen.
