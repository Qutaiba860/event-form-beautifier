import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]

# path to key file
key_file = ServiceAccountCredentials.from_json_keyfile_name("C:/Users/Lenovo/Desktop/vscode/Internship/KEYS/mineral-beaker-461207-q4-998ffd095366.json", scope)

client = gspread.authorize(key_file)

spreadsheet = client.open("EVENT MANAGEMENT FORM (Responses)")
worksheet = spreadsheet.sheet1
def fetch_event_data():
    records = worksheet.get_all_records()
    return records
