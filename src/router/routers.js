import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/login',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
  },
  {
    path: '/home-page',
    name: 'home-page',
    meta: {
      icon: 'ios-home',
      title: '首页'
    },
    component: Main,
    children: [
      {
        path: 'health-care-dept',
        name: 'health-care-dept',
        meta: {
          icon: 'ios-photos',
          title: '首页'
        },
        component: () => import('@/view/home-page/health-care-dept/health-care-dept.vue')
      },
      {
        path: 'doctor-page',
        name: 'doctor-page',
        meta: {
          icon: 'ios-photos',
          title: '首页'
        },
        component: () => import('@/view/home-page/doctor-page/doctor-page.vue')
      },
      {
        path: 'office-director-page',
        name: 'office-director-page',
        meta: {
          icon: 'ios-photos',
          title: '首页'
        },
        component: () => import('@/view/home-page/office-director-page/office-director-page.vue')
      },
      {
        path: 'dean-page',
        name: 'dean-page',
        meta: {
          icon: 'ios-photos',
          title: '首页'
        },
        component: () => import('@/view/home-page/dean-page/dean-page.vue')
      },
    ]
  },
  {
    path: '/core',
    name: 'core',
    meta: {
      icon: 'logo-buffer',
      title: '规则引擎管理'
    },
    component: Main,
    children: [
      {
        path: 'db-datasource',
        name: 'db-datasource',
        badge:true,
        meta: {
          icon: 'md-options',
          title: '数据源管理'
        },
        component: () => import('@/view/core/db-datasource/db-datasource.vue')
      },
      {
        path: 'datatable',
        name: 'datatable',
        meta: {
          icon: 'md-grid',
          title: '数据设置管理'
        },
        component: () => import('@/view/core/datatable/datatable.vue')
      },
      {
        path: 'fact-col-format',
        name: 'fact-col-format',
        meta: {
          icon: 'ios-funnel',
          title: '事件格式化'
        },
        component: () => import('@/view/core/fact-col-format/fact-col-format.vue')
      },
      {
        path: 'fact',
        name: 'fact',
        badge:true,
        meta: {
          icon: 'ios-apps',
          title: '事件原型管理'
        },
        component: () => import('@/view/core/fact/fact.vue')
      },
      {
        path: 'rule-preserve',
        name: 'rule-preserve',
        badge:true,
        meta: {
          icon: 'md-cog',
          title: '规则库管理'
        },
        component: () => import('@/view/core/rule-preserve/rule-preserve.vue')
      },
      {
        path: 'grouping-spec',
        name: 'grouping-spec',
        meta: {
          icon: 'ios-albums',
          title: '规则库数据分组'
        },
        component: () => import('@/view/core/grouping-spec/grouping-spec.vue')
      },
      {
        path: 'knowledge-version',
        name: 'knowledge-version',
        meta: {
          icon: 'ios-bookmarks',
          title: '规则库版本管理'
        },
        component: () => import('@/view/core/knowledge-version/knowledge-version.vue')
      } ,
      {
        path: 'knowledge-base',
        name: 'knowledge-base',
        meta: {
          icon: 'ios-book',
          title: '规则库打包管理'
        },
        component: () => import('@/view/core/knowledge-base/knowledge-base.vue')
      },
      {
        path: 'rule-datasource',
        name: 'rule-datasource',
        meta: {
          icon: 'ios-grid',
          title: '规则数据源维护'
        },
        component: () => import('@/view/core/rule-datasource/rule-datasource.vue')
      },
      // {
      //   path: 'engine-monitor',
      //   name: 'engine-monitor',
      //   meta: {
      //     icon: 'ios-albums',
      //     title: '规则引擎监控'
      //   },
      //   component: () => import('@/view/core/engine-monitor/engine-monitor.vue')
      // } ,
      {
        path: '/engine-basic-manage',
        name: 'engine-basic-manage',
        meta: {
          icon: 'ios-speedometer',
          title: '规则库目录对照',
        },
        component: parentView,
        children: [
          {
            path: 'med-consume-list',
            name: 'med-consume-list',
            meta: {
              icon: 'md-book',
              title: '耗材目录'
            },
            component: () => import('@/view/engine-basic-manage/med-consume-list/med-consume-list.vue')
          },
          {
            path: 'med-drug-list',
            name: 'med-drug-list',
            meta: {
              icon: 'md-book',
              title: '药品目录'
            },
            component: () => import('@/view/engine-basic-manage/med-drug-list/med-drug-list.vue')
          },
          {
            path: 'med-treat-list',
            name: 'med-treat-list',
            meta: {
              icon: 'md-book',
              title: '诊疗目录'
            },
            component: () => import('@/view/engine-basic-manage/med-treat-list/med-treat-list.vue')
          },
          {
            path: 'diagnose-list',
            name: 'diagnose-list',
            meta: {
              icon: 'md-book',
              title: '诊断目录'
            },
            component: () => import('@/view/engine-basic-manage/diagnose-list/diagnose-list.vue')
          },
        ],
      },
      {
        path: 'custom-rule',
        name: 'custom-rule',
        meta: {
          icon: 'ios-apps-outline',
          title: '自定义规则管理'
        },
        component: () => import('@/view/core/custom-rule/custom-rule.vue')
      } ,
    ]
  },
  {
    path: '/sys',
    name: 'sys',
    meta: {
      icon: 'md-cog',
      title: '系统参数管理',
    },
    component: Main,
    children: [
      {
        path: 'sys-params',
        name: 'sys-params',
        meta: {
          icon: 'md-cog',
          title: '系统基础参数',
        },
        component: () => import('@/view/authority-mgt/sys-params/sys-params.vue'),
      },
      {
        path: 'sys-event',
        name: 'sys-event',
        meta: {
          icon: 'ios-analytics',
          title: '系统日志'
        },
        component: () => import('@/view/system-event/sys-event/sys-event.vue')
      },
    ],
  },
  {
    path: '/authority-mgt',
    name: 'authority-mgt',
    meta: {
      icon: 'ios-card',
      title: '权限管理',
    },
    component: Main,
    children: [
      {
        path: 'role-mgt',
        name: 'role-mgt',
        meta: {
          icon: 'ios-contacts',
          title: '角色管理',
        },
        component: () => import('@/view/authority-mgt/role-mgt/role-mgt.vue'),
      }
    ],
  },

  {
    path: '/basic-data',
    name: 'basic-data',
    meta: {
      icon: 'md-cube',
      title: '基础设置管理',
    },
    component: Main,
    children: [
      {
        path: 'bd-org',
        name: 'bd-org',
        meta: {
          icon: 'ios-briefcase-outline',
          title: '机构管理',
        },
        component: () => import('@/view/basic-data/bd-org/bd-org.vue'),
      },
      {
        path: 'system-user',
        name: 'system-user',
        meta: {
          icon: 'md-contact',
          title: '用户管理'
        },
        component: () => import('@/view/authority-mgt/system-user/system-user.vue')
      },
      {
        path: 'dept-directory',
        name: 'dept-directory',
        meta: {
          icon: 'md-browsers',
          title: '科室管理'
        },
        component: () => import('@/view/authority-mgt/dept-directory/dept-directory.vue')
      },
      {
        path: 'sys-dictionary-item',
        name: 'sys-dictionary-item',
        meta: {
          icon: 'md-cog',
          title: '字典管理',
        },
        component: () => import('@/view/basic-data/sys-dictionary-item/sys-dictionary-item.vue')
      },
      {
        path: 'target-manage',
        name: 'target-manage',
        meta: {
          icon: 'ios-folder',
          title: '指标管理'
        },
        component: () => import('@/view/disease-mgt/target-manage-mgt/target-manage/target-manage.vue')
      },
      {
        path: 'policy-mgt',
        name: 'policy-mgt',
        meta: {
          icon: 'ios-folder',
          title: '政策管理'
        },
        component: () => import('@/view/disease-mgt/policy/policy-mgt.vue')
      },
      {
        path: 'bd-med-ins',
        name: 'bd-med-ins',
        meta: {
          icon: 'md-book',
          title: '目录管理'
        },
        component: parentView,
        children: [
          {
            path: 'medicare-drug-list',
            name: 'medicare-drug-list',
            meta: {
              icon: 'md-book',
              title: '药品目录'
            },
            component: () => import('@/view/basic-data/bd-med-ins/medicare-drug-list/medicare-drug-list.vue')
          },
          {
            path: 'diagnostic-directory',
            name: 'diagnostic-directory',
            meta: {
              icon: 'md-book',
              title: '诊断目录'
            },
            component: () => import('@/view/basic-data/bd-med-ins/diagnostic-directory/diagnostic-directory.vue')
          },
          {
            path: 'health-supplies',
            name: 'health-supplies',
            meta: {
              icon: 'md-book',
              title: '耗材目录'
            },
            component:() => import('@/view/basic-data/bd-med-ins/health-supplies/health-supplies.vue')
          },
          {
            path: 'health-treatment',
            name: 'health-treatment',
            meta: {
              icon: 'md-book',
              title: '诊疗目录',
            },
            component: () => import('@/view/basic-data/bd-med-ins/health-treatment/health-treatment.vue')
          },
        ],
      },
      //慢病维护
      {
        path: 'slow-disease',
        name: 'slow-disease',
        meta: {
          icon: 'ios-bug',
          title: '慢病管理'
        },
        component: parentView,
        children: [
          {
            path: 'slow-disease-mgt',
            name: 'slow-disease-mgt',
            meta: {
              icon: 'logo-dribbble',
              title: '病种设置'
            },
            component: () => import('@/view/disease-mgt/slow-disease/slow-disease-mgt/slow-disease-mgt.vue'),
          },
          {
            path: 'slow-drugs-mgt',
            name: 'slow-drugs-mgt',
            meta: {
              icon: 'ios-folder',
              title: '药品设置'
            },
            component: () => import('@/view/disease-mgt/slow-disease/slow-drugs-mgt/slow-drugs-mgt.vue')
          },
          {
            path: 'patient-inquire-detail',
            name: 'patient-inquire-detail',
            meta: {
              icon: 'ios-grid',
              title: '患者用记录详情',
              hideInMenu: true
            },
            component: () => import('@/view/disease-mgt/slow-disease/slow-patient-inquire/patient-inquire-detail.vue')
          },
        ]
      },
      //特病维护
      {
        path: 'special-disease',
        name: 'special-disease',
        meta: {
          icon: 'ios-alert-outline',
          title: '特病管理'
        },
        component: parentView,
        children: [
          {
            path: 'special-disease-mgt',
            name: 'special-disease-mgt',
            meta: {
              icon: 'ios-folder',
              title: '病种设置'
            },
            component: () => import('@/view/disease-mgt/special-disease/special-disease-mgt/special-disease-mgt.vue'),
          },
          {
            path: 'special-drugs-mgt',
            name: 'special-drugs-mgt',
            meta: {
              icon: 'ios-folder',
              title: '药品设置'
            },
            component: () => import('@/view/disease-mgt/special-disease/special-drugs-mgt/special-drugs-mgt.vue')
          },
        ]
      },
      //单病维护
      {
        path: '/single-disease',
        name: 'single-disease',
        meta: {
          icon: 'ios-barcode',
          title: '单病种管理',
          showAlways: true,
        },
        component: parentView,
        children: [
          {
            path: 'single-disease-manage',
            name: 'single-disease-manage',
            meta: {
              icon: 'ios-folder',
              title: '病种设置'
            },
            component: () => import('@/view/disease-mgt/single-disease/single-disease.vue'),
          },
        ],
      },
      {
        path: 'manage',
        name: 'manage',
        meta: {
          icon: 'ios-calculator',
          title: '总额管理'
        },
        component: parentView,
        children: [
          {
            path: 'total_manage',
            name: 'total_manage',
            meta: {
              icon: 'ios-folder',
              title: '总额设置'
            },
            component: () => import('@/view/disease-mgt/manage/total_manage.vue'),
          },
          {
            path: 'total_manage_dept',
            name: 'total_manage_dept',
            meta: {
              icon: 'ios-archive',
              title: '科室设置'
            },
            component: () => import('@/view/disease-mgt/manage/total_manage_dept.vue')
          },
        ]
      },
    ],
  },
  {
    path: '/control-cost-mgt',
    name: 'control-cost-mgt',
    meta: {
      icon: 'logo-yen',
      title: '控费管理',
    },
    component: Main,
    children: [
      {
        path: 'violation-handling',
        name: 'violation-handling',
        meta: {
          icon: 'ios-alert',
          title: '违规处理'
        },
        component: () => import('@/view/control-cost-mgt/violation/violation-handling.vue')
      },
      {
        path: 'check-handle',
        name: 'check-handle',
        meta: {
          icon: 'ios-checkbox',
          title: '审核处理'
        },
        component: () => import('@/view/control-cost-mgt/check/check-handling.vue')
      },
    ],
  },

  {
    path: '/violation-monitor-mgt',
    name: 'violation-monitor-mgt',
    meta: {
      icon: 'ios-pulse',
      title: '已违规监控'
    },
    component: Main,
    children: [
      {
        path: 'violation-analyze',
        name: 'violation-analyze',
        meta: {
          icon: 'ios-link',
          title: '监控中心'
        },
        component: () => import('@/view/control-cost-mgt/violation-analyze/violation-analyze.vue'),
      },
      {
        path: 'violation-monitor',
        name: 'violation-monitor',
        meta: {
          icon: 'ios-eye',
          title: '已违规查询'
        },
        component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor.vue'),
      },
    ]
  },
  {
    path: '/total-search',
    name: 'total-search',
    meta: {
      icon: 'md-search',
      title: '综合查询分析',
    },
    component: Main,
    children: [
      {
        path: 'target-analyze',
        name: 'target-analyze',
        meta: {
          icon: 'ios-stats',
          title: '监控指标分析'
        },
        component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-analyze.vue')
      },
      {
        path: 'policy-analysis',
        name: 'policy-analysis',
        meta: {
          icon: 'md-link',
          title: '医保政策对标'
        },
        component: () => import('@/view/disease-mgt/policy/policy-analysis.vue')
      },
      {
        path: 'single-analyze',
        name: 'single-analyze',
        meta: {
          icon: 'ios-trending-up',
          title: '单病种分析'
        },
        component: () => import('@/view/disease-mgt/single-disease/single-analyze.vue')
      },
      {
        path: 'special-patient-inquire',
        name: 'special-patient-inquire',
        meta: {
          icon: 'ios-git-commit',
          title: '特病用药查询'
        },
        component: () => import('@/view/disease-mgt/special-disease/special-patient-inquire/special-patient-inquire.vue')
      },
      {
        path: 'slow-patient-inquire',
        name: 'slow-patient-inquire',
        meta: {
          icon: 'ios-ionic',
          title: '慢病用药查询'
        },
        component: () => import('@/view/disease-mgt/slow-disease/slow-patient-inquire/slow-patient-inquire.vue')
      },
      {
        path: 'total_query',
        name: 'total_query',
        meta: {
          icon: 'ios-search',
          title: '总额查询'
        },
        component: () => import('@/view/disease-mgt/manage/total_query.vue')
      },
    ]
  },
  // {
  //   path: '/smart-monitor',
  //   name: 'smart-monitor',
  //   meta: {
  //     icon: 'ios-radio',
  //     title: '智能监控',
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'examine-list',
  //       name: 'examine-list',
  //       meta: {
  //         icon: 'ios-filing',
  //         title: '审批列表'
  //       },
  //       component: () => import('@/view/smart-monitor/examine-list/examine-list.vue')
  //     },
  //
  //     {
  //       path: 'historical-monitor',
  //       name: 'historical-monitor',
  //       meta: {
  //         icon: 'ios-clock',
  //         title: '历史监控'
  //       },
  //       component: () => import('@/view/smart-monitor/historical-monitor/historical-monitor.vue')
  //     },
  //   ],
  // },
  {
    path: '/test',
    name: 'test',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'violation-detail',
        name: 'violation-detail',
        meta: {
          icon: 'md-flower',
          title: '违规详情',
          notCache: true
        },
        component: () => import('@/view/control-cost-mgt/violation/violation-detail.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'check-detail',
        name: 'check-detail',
        meta: {
          icon: 'ios-grid',
          title: '审核详情'
        },
        component: () => import('@/view/control-cost-mgt/check/check-detail.vue')
      }
    ]
  },
  {
    path: '/monitor',
    name: 'monitor',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'violation-monitor-detail',
        name: 'violation-monitor-detail',
        meta: {
          icon: 'ios-grid',
          title: '违规监控详情'
        },
        component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor-detail.vue')
      }
    ]
  },
  {
    path: '/single',
    name: 'single',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'single-disease-details',
        name: 'single-disease-details',
        meta: {
          icon: 'ios-grid',
          title: '单病种详情'
        },
        component: () => import('@/view/disease-mgt/single-disease/single-disease-details.vue')
      }
    ]
  },
  {
    path: '/monitor-remind',
    name: 'monitor-remind',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'examine-list-detail',
        name: 'examine-list-detail',
        meta: {
          icon: 'ios-grid',
          title: '审批列表详情'
        },
        component: () => import('@/view/smart-monitor/examine-list/examine-list-detail.vue')
      }
    ]
  },
  {
    path: '/target',
    name: 'target',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'target-list',
        name: 'target-list',
        meta: {
          icon: 'ios-filing',
          title: '指标列表',
        },
        component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-list.vue')
      },
      {
        path: 'target-detail',
        name: 'target-detail',
        meta: {
          icon: 'ios-grid',
          title: '指标列表详情'
        },
        component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-detail.vue')
      }
    ]
  },

  {
    path: '/historical',
    name: 'historical',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'historical-detail',
        name: 'historical-detail',
        meta: {
          icon: 'ios-grid',
          title: '历史监控详情'
        },
        component: () => import('@/view/smart-monitor/historical-monitor/historical-detail.vue')
      }
    ]
  },
  {
    path: '/single-hide',
    name: 'single-hide',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'single-disease-list',
        name: 'single-disease-list',
        meta: {
          icon: 'ios-filing',
          title: '单病种明细列表'
        },
        component: () => import('@/view/disease-mgt/single-disease/single-disease-list.vue')
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
]
