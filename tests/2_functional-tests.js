const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {
        test('Every field filled in', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Every field filled in',
                assigned_to: 'Chai and Mocha',
                status_text: 'In QA'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
                assert.equal(res.body.assigned_to, 'Chai and Mocha');
                assert.equal(res.body.status_text, 'In QA');
                assert.equal(res.body.open, true);
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'updated_on');
                assert.property(res.body, '_id');
                done();
            });
        });
    
        test('Required fields filled in', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Required fields filled in'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.equal(res.body.open, true);
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'updated_on');
                assert.property(res.body, '_id');
            done();
            });
        });
    
        test('Missing required field: issue_text', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Title',
                created_by: 'Functional Test - Required field: issue_text'
            })
                .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
        });

        test('Missing required field: created_by', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Title',
                issue_text: 'text'
            })
                .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
        });

        test('Missing required field: issue_title', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_text: 'text',
                    created_by: 'Functional Test - Required field: title'
                })
                    .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });

        test('get request', function(done) {
            chai.request(server)
                .get('/api/issues/test')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });

        test('get request with 1 filter', function(done) {
            chai.request(server)
                .get('/api/issues/test?issue_title=Title')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body[0].issue_title, 'Title');
                    done();
                });
        });

        test('get request with multiple filters', function(done) {
            chai.request(server)
                .get('/api/issues/test?issue_title=Title&issue_text=text')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body[0].issue_title, 'Title');
                    assert.equal(res.body[0].issue_text, 'text');
                    done();
                });
        });

        test('put request', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: '1',
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                    open: false
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('put request changing only open', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: '1',
                    open: true
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('put request with missing _id', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                    open: false
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('put request with no update fields', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: '5f2c4b8c7f4d3d0017f5d4f5'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'no update field(s) sent');
                    done();
                });
        });

        test('put request with invalid _id', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: '5f2c4b8c7f4d3d0017f5d4f6',
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                    open: false
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not update');
                    done();
                });
        });

        test('delete request', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: '1'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    done();
                });
        });

        test('delete request with missing _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
    });
});
