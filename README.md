# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- vercel push

 use following commands to clone database to your system 
 psql -U postgres -h localhost -c "CREATE DATABASE specselect;"

 
 pg_restore -U postgres -h localhost -d specselect -v ./backend/backup/specselect_backup.dump

 

 use following commands to clone database to your system 
 psql -U postgres -h localhost -c "CREATE DATABASE specselect;"
 pg_restore -U postgres -h localhost -d specselect -v ./bakcend/backup/specselect_backup.dump