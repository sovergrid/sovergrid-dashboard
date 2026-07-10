import os
import re

directory = "/home/joel/Documents/agent/sovergrid-dashboard"

# Define the global replacements
replacements = {
    "#6C63FF": "#7C3AED",
    "#6c63ff": "#7C3AED",
    "#F5F4EF": "#F8F7F4",
    "#f5f4ef": "#F8F7F4",
}

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith((".html", ".css", ".js")):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            
            original_content = content
            
            # Special case for new-deployment.html provider-card.selected
            if file == "new-deployment.html":
                # Find .provider-card.selected and replace its properties
                # Old: .provider-card.selected { border-color:#6C63FF; background:#EEECFF; }
                content = re.sub(
                    r'\.provider-card\.selected\s*\{[^}]+\}',
                    r'.provider-card.selected { border-color: var(--accent); background: var(--accent-gradient); }\n    .provider-card.selected * { color: #fff !important; border-color: rgba(255,255,255,0.3) !important; background: transparent !important; }',
                    content
                )
            
            # Apply global hex replacements
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            if content != original_content:
                with open(filepath, "w") as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Done")
