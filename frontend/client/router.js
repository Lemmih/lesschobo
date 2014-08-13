/*
Routes:
/                       landing page
/home/                  home
/courses/               view courses
/courses/id/review      Study, don't introduce new cards.
/courses/id/n/          View nth unit.
/courses/id/n/study     Study upto and including the nth unit.
*/


Router.configure({
  layoutTemplate: 'layout'
});
Router.map(function () {
  this.route('landing', {
    path: '/',
    layoutTemplate: null,
    loadingTemplate: 'loading'
  });
  this.route('home', {
    path: '/home/',
    waitOn: function() {
      return Meteor.call('listUnits', function (err, data) {
        console.log('Got unit list', data);
        // XXX: Use an anonymous collection instead of a session variable.
        Session.set('units', data);
        // return {units: data};
      });
    },
    data: function () {
      return {units: Session.get('units')};
    }
  });

  this.route('review', {
    layoutTemplate: 'learnLayout',
    path: '/courses/:id/:slug/review',
    data: function () {
      return {
        course: Courses.findOne({_id: this.params.id}),
        courseId: this.params.id,
        slug: this.params.slug,
        action: 'review'
      };
    }
  });

  this.route('study', {
    template: 'studyCourse',
    layoutTemplate: 'learnLayout',
    path: '/courses/:id/:slug/:nth/study',
    data: function () {
      return {
        course: Courses.findOne({_id: this.params.id}),
        courseId: this.params.id,
        slug: this.params.slug,
        unitIndex: this.params.nth,
        action: 'study'
      };
    }
  });


  this.route('view', {
    layoutTemplate: 'learnLayout',
    path: '/courses/:id/:slug/:nth/',
    data: function () {
      return {
        course: Courses.findOne({_id: this.params.id}),
        courseId: this.params.id,
        slug: this.params.slug,
        unitIndex: this.params.nth,
        action: 'view'
      };
    }
  });

  this.route('viewCourse', {
    path: '/courses/:id/:slug/',
    data: function () {
      return {
        courseId: this.params.id,
      };
    }
  });

  this.route('browseCourses', {
    path: '/courses/'
  });
});
