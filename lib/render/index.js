function Render (mailer) {
  this.mailer = mailer;
  this.options = {};
}

/**
 * Render a message
 *
 * # Example:
 *
 *   posteon.render({..., {html: 'Hello <%=name%>!', to: {data: {name: 'John'}, ..}}});
 *
 * @param {Object} message
 * @param {Function} callback
 * @method render
 * @api public
 */

Render.prototype.render = function (message, callback) {
  //@TODO
  callback(null, message);
};


module.exports = function (mailer) {
  return new Render(mailer);
};
