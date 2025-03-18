'use strict';

// use a database to store the issues, for now we will use an object
// to store the issues
let projectIssues = {};
let issueId =  0;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const { _id, issue_title, issue_text , created_by, assigned_to, status_text, created_on, updated_on,  open} = req.query;
      
      const issues = projectIssues[project];
      let filteredIssues = issues.filter(issue => {
        return (_id === undefined || issue._id === _id) &&
               (issue_title === undefined || issue.issue_title === issue_title) &&
               (issue_text === undefined || issue.issue_text === issue_text) &&
               (created_by === undefined || issue.created_by === created_by) &&
               (assigned_to === undefined || issue.assigned_to === assigned_to) &&
               (status_text === undefined || issue.status_text === status_text) &&
               (created_on === undefined || issue.created_on === created_on) &&
               (updated_on === undefined || issue.updated_on === updated_on) &&
               (open === undefined || issue.open === open);
      });

      res.json(filteredIssues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }

      const newIssue = {
        _id: "" + issueId++,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      };

      if (!projectIssues[project])
        projectIssues[project] = [];
      
      projectIssues[project].push(newIssue);

      res.json(newIssue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }
      else if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        res.json({ error: 'no update field(s) sent', _id: _id });
        return;
      }

      const issues = projectIssues[project];
      const issue = issues.find(issue => issue._id == _id);
      if (!issue) {
        res.json({ error: 'could not update', _id: _id });
        return;
      }

      issue.issue_title = issue_title || issue.issue_title;
      issue.issue_text = issue_text || issue.issue_text;
      issue.created_by = created_by || issue.created_by;
      issue.assigned_to = assigned_to || issue.assigned_to;
      issue.status_text = status_text || issue.status_text;
      issue.open = open ? false : issue.open;
      issue.updated_on = new Date();

      res.json({result: 'successfully updated', _id: _id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }

      const issues = projectIssues[project];
      const index = issues.findIndex(issue => issue._id == _id);
      if (index === -1) {
        res.json({ error: 'could not delete', _id: _id });
        return;
      }
      
      issues.splice(index, 1);
      res.json({ result: 'successfully deleted', _id: _id });
      
    });
    
};
