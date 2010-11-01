require 'test_helper'

class RedirectionTest < ActiveSupport::TestCase
  test "generate 6 characters permalink if nil" do
    r = Redirection.create(:url => 'http://example.com')
    assert_equal(r.permalink.length, 6)
  end
  
  test "generate 7 characters permalink if permalink exists" do
    r = Redirection.create(:url => 'http://example.com', :permalink => 'perma1')
    assert_equal(r.permalink.length, 7)
  end
  
   test "allow any defined permalink if available" do
    r = Redirection.create(:url => 'http://example.com', :permalink => 'permalink3')
    assert_equal(r.permalink, 'permalink3')
  end
  
  test "allow editing link without changing permalink" do
    r = Redirection.create(:url => 'http://example.com', :permalink => 'permalink4')
    assert_equal(r.url, 'http://example.com')
    assert_equal(r.permalink, 'permalink4')
    r.url = 'http://secondbureau.com'
    r.save
    assert_equal(r.url, 'http://secondbureau.com')
    assert_equal(r.permalink, 'permalink4')
  end
  
end
