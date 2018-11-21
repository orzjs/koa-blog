const apiBlog = require('./controller');
const path = require('path');
const fs = require('fs-extra');
const multer = require('koa-multer');
const config = require('../../config/config');

const uploadPath = config.uploadPath;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const u = req.body.uuid;
    fs.mkdirp(path.join(uploadPath, u), err => {
      if (err) {
        cb(err);
      } else {
        cb(null, `${u}/${file.originalname}`);
      }
    });
  }
});

const upload = multer({ storage });

function routeBlog(router) {

  router.get('/', blog);
  router.get('/blog/(.*)', blog);
  router.get('/api/blog', apiBlog.getList);
  // 删除博客
  router.delete('/api/blog', apiBlog.deleteBlog);
  router.get('/api/blog/:id', apiBlog.getBlogById);
  router.post('/api/publish', apiBlog.publishBlog);
  router.put('/api/publish', apiBlog.updateBlog);
  router.post('/api/uploadFile', upload.single('file'), apiBlog.uploadFile);

  async function blog(ctx) {
    switch(ctx.path) {
      // 必须登录才能发表
      case '/blog/publish':
      case '/blog/update':
        if (ctx.isUnauthenticated()) {
          ctx.redirect('/');
        } else {
          await ctx.render('../../client/public/views/blog/blog.ejs', {userInfo: ctx.state.user});
        }
        break;
      default:
        await ctx.render('../../client/public/views/blog/blog.ejs', {userInfo: ctx.state.user});
        break;
    }
  }
}

module.exports = routeBlog;
