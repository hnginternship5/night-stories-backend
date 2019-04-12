const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../src/app');
chai.use(chaiHTTP);
require('chai/register-should');

// BOOKMARK tests
