NAME="mm"
cd magic-mirror
tmux new-session -s "$NAME" -d
tmux send-keys -t "$NAME" "node src/server.js" Enter
tmux split-window -h -t "$NAME"
tmux send-keys -t "$NAME" "workon magicmirror && python vision/main.py" Enter
tmux new-window -a -t "$NAME"
tmux send-keys -t "$NAME" "./scripts/kiosk.sh" Enter
tmux split-window -h -t "$NAME"
tmux select-window -l -t "$NAME"
tmux -2 attach-session -t "$NAME"
