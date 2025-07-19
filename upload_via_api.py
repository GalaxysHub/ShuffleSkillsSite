#!/usr/bin/env python3
import subprocess
import requests
import sys

def get_access_token():
    """Get Firebase access token using CLI"""
    try:
        result = subprocess.run(['npx', 'firebase', 'auth:print-access-token'], 
                              capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error getting access token: {e}")
        return None

def upload_file(file_path, storage_path, access_token):
    """Upload file to Firebase Storage"""
    url = f"https://firebasestorage.googleapis.com/v0/b/shuffle-tut.firebasestorage.app/o/{storage_path}"
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'image/gif'
    }
    
    try:
        with open(file_path, 'rb') as f:
            response = requests.post(url, headers=headers, data=f)
        
        if response.status_code == 200:
            print(f"✅ Successfully uploaded {file_path}")
            print(f"📎 URL: https://firebasestorage.googleapis.com/v0/b/shuffle-tut.firebasestorage.app/o/{storage_path}?alt=media")
            return True
        else:
            print(f"❌ Upload failed for {file_path}: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error uploading {file_path}: {e}")
        return False

def main():
    print("🚀 Starting GIF upload...")
    
    # Get access token
    access_token = get_access_token()
    if not access_token:
        print("❌ Failed to get access token")
        sys.exit(1)
    
    # Upload files
    files = [
        ('t-step.gif', 'gifs%2Ft-step.gif'),
        ('front-hook-kick.gif', 'gifs%2Ffront-hook-kick.gif')
    ]
    
    success_count = 0
    for local_file, storage_path in files:
        if upload_file(local_file, storage_path, access_token):
            success_count += 1
    
    if success_count == len(files):
        print("\n🎉 All uploads completed successfully!")
    else:
        print(f"\n⚠️  {success_count}/{len(files)} uploads successful")

if __name__ == "__main__":
    main()