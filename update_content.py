import os
import re

# Configuration
ROOT_DIR = r"c:\Users\shivam rai\Desktop\Mantravi\dp-website"
OLD_EMAIL = "info@dpjewellers.com"
NEW_EMAIL = "info@dpjewellersballia.com"
NEW_ADDRESS = "NCC Tiraha, Tikhampur, Ballia, Uttar Pradesh 277001, India"

# Regex for the address variations (captures multiline and spacing variations)
# 1. Chowk, Station Road...
# 2. Address: ...
ADDRESS_REGEX_1 = re.compile(r"Chowk,\s*Station\s*Road,\s*Okdenganj,\s*(?:<br\s*/?>)?\s*Ballia\s*-\s*277001,\s*Uttar\s*Pradesh\.", re.IGNORECASE | re.DOTALL)
ADDRESS_REGEX_2 = re.compile(r"Address:\s*</strong>\s*Chowk,\s*Station\s*Road,\s*Okdenganj,\s*Ballia\s*-\s*\n\s*277001,\s*Uttar\s*Pradesh\.", re.IGNORECASE | re.DOTALL)


def update_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        
        # Replace Email
        content = content.replace(OLD_EMAIL, NEW_EMAIL)
        
        # Replace Address (Regex 1 - Footer/Simple)
        content = ADDRESS_REGEX_1.sub(NEW_ADDRESS, content)
        
        # Replace Address (Regex 2 - Contact Page specific with </strong>)
        # We need to be careful to keep the <strong>Address:</strong> prefix if we match it, 
        # but the regex above includes it. The user said "Wherever the address is used, replace it".
        # If the regex matches "Address: </strong> ... old ...", we should ideally replace the whole thing 
        # or just the address part. 
        # Let's adjust the regex to only match the address part if possible, or reconstruct.
        # Actually, looking at contact.html:
        # <strong>Address:</strong> Chowk, Station Road, Okdenganj, Ballia -
        #           277001, Uttar Pradesh.
        #
        # I will replace the address part only.
        
        # Refined strategy: simple replace for the specific string structure found in contact.html manually if regex fails,
        # but let's try a robust regex for the address text itself, ignoring the label.
        
        # Pattern for the specific address text, handling newlines/spaces
        address_pattern = r"Chowk,\s*Station\s*Road,\s*Okdenganj,.*?(?:<br\s*/?>)?.*?Ballia.*?-.*?277001,.*?Uttar\s*Pradesh\."
        
        content = re.sub(address_pattern, NEW_ADDRESS, content, flags=re.IGNORECASE | re.DOTALL)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {filepath}")
        else:
            # print(f"No changes: {filepath}")
            pass

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    print("Starting update process...")
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                update_file(os.path.join(root, file))
    print("Update process complete.")

if __name__ == "__main__":
    main()
