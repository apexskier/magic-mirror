#!/bin/bash
echo "Opening chrome in background"
chromium-browser --kiosk http://localhost:8101 --noerrdialogs --incognito &
