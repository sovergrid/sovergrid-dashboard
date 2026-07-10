import os

directory = "/home/joel/Documents/agent/sovergrid-dashboard"

# Define the global replacements
replacements = {
    "#EEECFF": "#F5F3FF",
    "#eeecff": "#F5F3FF",
    "#4038C7": "#5B21B6",
    "#4038c7": "#5B21B6",
    "#C4BFFF": "#DDD6FE",
    "#c4bfff": "#DDD6FE",
    "#4B44D9": "#5B21B6",
    "#4b44d9": "#5B21B6",
}

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith((".html", ".css", ".js")):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            
            original_content = content
            
            # Apply global hex replacements
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            if content != original_content:
                with open(filepath, "w") as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Done")
