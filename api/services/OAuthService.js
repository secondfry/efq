/*
 * Copyright (c) 2014 – 2017. Rustam @Second_Fry Gubaydullin.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = {

  /**
   * Talk to CCP server with authCode and ask for tokens
   * @param authCode    Auth code received after client granted access
   * @returns {Promise} Returns tokens data
   */
  requestToken: (authCode) => {
    let
      request = require('request'),
      token_url = 'https://login.eveonline.com/oauth/token',
      options = {
        json: true,
        body: {
          grant_type: 'authorization_code',
          code: authCode
        }
      };
    return new Promise((resolve, reject) => {
      request
        .post(token_url, options)
        .auth(ApplicationService.clientID, ApplicationService.clientKey).body()
        .on('data', (data) => {
          return resolve(data);
        })
        .on('error', (err) => {
          return reject(err);
        });
    })
  },

  /**
   * Talk to CCP server with access_token and ask for character info
   * @param tokensData  Token data received after contacting CCP servers with auth code
   * @returns {Promise} Returns verification data extended with tokens data
   */
  requestVerification: (tokensData) => {
    let
      request = require('request'),
      verify_url = 'https://login.eveonline.com/oauth/verify';
    return new Promise((resolve, reject) => {
      request
        .get(verify_url)
        .auth(null, null, true, tokensData.access_token)
        .on('data', (data) => {
          return resolve(_.extend(data, tokensData));
        })
        .on('error', (err) => {
          return reject(err);
        })
    });
  }

};
