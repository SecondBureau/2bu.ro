require 'net/http'
 
# Original credits: http://blog.inquirylabs.com/2006/04/13/simple-uri-validation/
# HTTP Codes: http://www.ruby-doc.org/stdlib/libdoc/net/http/rdoc/classes/Net/HTTPResponse.html
 
class UrlValidator < ActiveModel::EachValidator
  def validate_each(r, a, v)
    configuration = { :message => "is not valid or not responding", :with => nil }
    raise(ArgumentError, "A regular expression must be supplied as the :with option of the configuration hash") unless options[:with].is_a?(Regexp)
        if v.to_s =~ options[:with] # check RegExp
              begin # check header response
                  case Net::HTTP.get_response(URI.parse(v))
                    when Net::HTTPMovedPermanently
                      r.errors.add(a, 'Page is redirected, link to real page') and false
                    when Net::HTTPSuccess
                      true
                    else
                      true
                      #r.errors.add(a, configuration[:message]) and false
                  end
              rescue Exception => e# Recover on DNS failures..
                  #r.errors.add(a, configuration[:message]) and false
                  true
              end
        else
          r.errors.add(a, configuration[:message]) and false
        end
  end
end