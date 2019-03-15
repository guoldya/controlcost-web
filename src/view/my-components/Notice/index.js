import Notification from 'iview/src/components/base/notification/index.js';
const prefixCls = 'ivu-notice';
const iconPrefixCls = 'ivu-icon';
const prefixKey = 'ivu_notice_key_';

let top = 24;
let defaultDuration = 0;
let noticeInstance;
let name = 1;


const iconTypes = {
  'info': 'ios-information-circle',
  'success': 'ios-checkmark-circle',
  'warning': 'ios-alert',
  'error': 'ios-close-circle'
};

function getNoticeInstance () {
  noticeInstance = noticeInstance || Notification.newInstance({
    prefixCls: prefixCls,
    styles: {
      top: `${top}px`,
      right:0,
    },
  });

  return noticeInstance;
}

function notice (type, options) {
  const title = options.title || '';
  const desc = options.desc || '';
  const name1 = options.name1 || '';
  const sex = options.sex || '';
  const age = options.age || '';
  const insType = options.insType || '';
  const numbers = options.numbers || '';
  const itemName = options.itemName || '';
  const quantities = options.quantities || '';
  const unit = options.unit || '';
  const pass = options.pass || '';
  const exName = options.exName || '';
  const office = options.office || '';
  const time = options.time || '';
  const approval = options.approval || '';
  const noticeKey = options.name || `${prefixKey}${name}`;
  const onClose = options.onClose || function () {};
  const render = options.render;
  // todo const btn = options.btn || null;
  const duration = (options.duration === 0) ? 0 : options.duration || defaultDuration;

  name++;

  let instance = getNoticeInstance();

  let content;

  let withIcon;

  const with_desc = (options.render && !title) ? '' : (desc || options.render) ? ` ${prefixCls}-with-desc` : '';

  if (type == 'normal') {
    withIcon = false;
      content = `
            <style lang="less">
              @import "../../../styles/common.less";
            </style>
            
            <div class="${prefixCls}-custom-content ${prefixCls}-with-normal ${with_desc}">
                <div class="margin-bottom-10">${title}</div>
                <hr class="margin-bottom-10">
                 <div class="margin-bottom-10">
                   <span class="spans">${name1}</span>
                   <span class="spans">${sex}</span>
                   <span class="spans">${age}</span>
                   <span class="spans">${insType}</span>
                   <span class="spans"> 门诊号:${numbers}</span>
                 </div>
                 <div class="margin-bottom-10">
                   <span class="spans1">审批项目:${itemName}</span>
                   <span class="spans1">X${quantities}${unit}</span>
                 </div>
                <div class="margin-bottom-10">
                   <span class="spans2">审批结果:${pass}</span>
                   <span class="spans2">审批人:${exName}</span>
                   <span class="spans2">审批科室:${office}</span>
                 </div>
                  <div class="margin-bottom-10">
                    <div class="spans3">
                      <span >审批时间:${time}</span>
                    </div>
                   <span class="spans3">审批意见:${approval}。</span>
                 </div>
                 <hr class="margin-bottom-10">
                 <div style="float: right;"><a href="#" on-click="" style="color: #000;">>>>查看详情</a></div>
            </div>
        `;
  } else {
    const iconType = iconTypes[type];
    const outlineIcon = with_desc === '' ? '' : '-outline';
    withIcon = true;
    content = `
            <div class="${prefixCls}-custom-content ${prefixCls}-with-icon ${prefixCls}-with-${type} ${with_desc}">
                <span class="${prefixCls}-icon ${prefixCls}-icon-${type}">
                    <i class="${iconPrefixCls} ${iconPrefixCls}-${iconType}${outlineIcon}"></i>
                </span>
                <div class="${prefixCls}-title">${title}</div>
                <div class="${prefixCls}-desc">${desc}</div>
            </div>
        `;
  }
  instance.notice({
    name: noticeKey.toString(),
    duration: duration,
    styles: {},
    transitionName: 'move-notice',
    content: content,
    withIcon: withIcon,
    render: render,
    hasTitle: !!title,
    onClose: onClose,
    closable: true,
    type: 'notice'
  });
}

export default {
  open (options) {
    return notice('normal', options);
  },
  info (options) {
    return notice('info', options);
  },
  success (options) {
    return notice('success', options);
  },
  warning (options) {
    return notice('warning', options);
  },
  error (options) {
    return notice('error', options);
  },
  config (options) {
    if (options.top) {
      top = options.top;
    }
    if (options.duration || options.duration === 0) {
      defaultDuration = options.duration;
    }
  },
  close (name) {
    if (name) {
      name = name.toString();
      if (noticeInstance) {
        noticeInstance.remove(name);
      }
    } else {
      return false;
    }
  },
  destroy () {
    let instance = getNoticeInstance();
    noticeInstance = null;
    instance.destroy('ivu-notice');
  }
};
