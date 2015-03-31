import webapp2
import os
from google.appengine.ext.webapp import template

		
class home(webapp2.RequestHandler):
	def get(self):			
		html = template.render('templates/index.html', {})
		self.response.out.write(html)
		
app = webapp2.WSGIApplication([('/', home),
							  
                              ],
                              debug=True)

