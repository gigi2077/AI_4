# Import the tools we need
import requests
from bs4 import BeautifulSoup  # <-- We are now using BeautifulSoup instead of Document
from markdownify import markdownify as md

# The URL and output file remain the same
URL = "https://transparency.ge/ge/blog/magali-donis-korupciis-savaraudo-shemtxvevebi-ganaxlebadi-sia"
OUTPUT_FILE = "data.txt"

def fetch_and_clean_article():
    """
    This function fetches the article from the URL, cleans it using a
    precise targeting method, converts it to Markdown, and saves it.
    """
    print(f"Fetching article from {URL}...")
    
    try:
        # Step 1: Get the raw HTML from the website (same as before)
        response = requests.get(URL)
        response.raise_for_status()
        html_content = response.text
        
        # --- THIS IS THE UPDATED PART ---
        # Step 2: Instead of guessing, we now precisely target the article's container.
        # We use BeautifulSoup to parse the HTML.
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # We inspected the website's HTML and found that the entire article
        # is inside a <div> with the class "field-item even".
        # This line tells the program to find that exact container.
        article_div = soup.find('div', class_='field-item even')
        
        # Add a check to make sure we found the article container
        if not article_div:
            print("Error: Could not find the main article content on the page.")
            print("The website's structure might have changed.")
            return

        # Convert ONLY the HTML of our target container to a string
        clean_html = str(article_div)
        # --- END OF UPDATED PART ---

        # Step 3: Convert the clean HTML into Markdown (same as before)
        markdown_text = md(clean_html)
        
        # Step 4: Save the clean Markdown to our data.txt file (same as before)
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(markdown_text)
        
        print(f"Successfully updated {OUTPUT_FILE} with the LATEST and FULL article content!")

    except requests.exceptions.RequestException as e:
        print(f"Error: Could not fetch the website. Details: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# This part remains the same
if __name__ == "__main__":
    fetch_and_clean_article()