import os
import re

src = r'd:\Delop\views\index.html'
dest_dir = r'd:\Delop\views\cyberpunk-portfolio'

os.makedirs(os.path.join(dest_dir, 'css'), exist_ok=True)
os.makedirs(os.path.join(dest_dir, 'js'), exist_ok=True)
os.makedirs(os.path.join(dest_dir, 'images'), exist_ok=True)
os.makedirs(os.path.join(dest_dir, 'assets'), exist_ok=True)

with open(src, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
style_match = style_pattern.search(content)
if style_match:
    css_content = style_match.group(1).strip()
    with open(os.path.join(dest_dir, 'css', 'style.css'), 'w', encoding='utf-8') as f:
        f.write(css_content)
    content = content[:style_match.start()] + '<link rel="stylesheet" href="css/style.css">' + content[style_match.end():]

# Extract JS
script_blocks = list(re.finditer(r'<script>(.*?)</script>', content, re.DOTALL))
for match in reversed(script_blocks):
    script_text = match.group(1)
    if 'tailwind.config' not in script_text and 'Math.cos' in script_text:
        with open(os.path.join(dest_dir, 'js', 'main.js'), 'w', encoding='utf-8') as f:
            f.write(script_text.strip())
        content = content[:match.start()] + '<script src="js/main.js"></script>' + content[match.end():]
        break

with open(os.path.join(dest_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(content)

print('Restructuring complete!')
