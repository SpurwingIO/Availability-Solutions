module.exports = {
  apps : [{
    name: 'sp_avail_s01',
    script: 'server.js',
    args: '',
    autorestart: true,
    log_date_format: 'HH:mm:ss',
    watch: true,
    ignore_watch : ["db", "tmp", ".git"],
    max_memory_restart: '2G',
  }]
};
