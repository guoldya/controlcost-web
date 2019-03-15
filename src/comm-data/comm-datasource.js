import customstore from 'devextreme/data/custom_store';
import {
    post,
    put,
    del,
    patch,
    get
} from '@/api/api';
import {
    Message
} from 'iview';
import dataquery from 'devextreme/data/query';
//Url
let resultRows = 'rows';
let resultData = 'data';

let Ds = {};
Ds.loadPage = function (loadOptions, url, loadFlag, params, refreshTarget) {
    var deferred = $.Deferred(),
        params = params;
    // 分页大小
    params.pageSize = loadOptions.take || 10;
    // 分页偏移
    params.offset = loadOptions.skip || 0;

    if (loadOptions.sort) {
        params.orderBy = loadOptions.sort[0].selector;
        if (loadOptions.sort[0].desc) {
            params.sortAsc = 'N';
        } else {
            params.sortAsc = 'Y';
        }
    }
    // 传入过滤参数
    params.filter = loadOptions.searchData;
    // 按需加载
    if (!loadFlag) {
        deferred.resolve([], {
            totalCount: 0
        });
    } else {
        put(url, params).then(res => {
            if (res.code === '200') {
                if (loadOptions.filter) {
                    var result = dataquery(res.rows).filter(loadOptions.filter).toArray();
                    deferred.resolve(result, {
                        totalCount: result.length
                    });
                } else {
                    deferred.resolve(res.rows, {
                        totalCount: res.total
                    });
                }
            } else {
                // 提示信息
                Message.warning(res.msg);
                if (typeof (func) != 'undefined')
                    target.refresh();
            }
        }).catch(err => {
            deferred.resolve([], {
                totalCount: 0
            });
            let msg = getmsg(err);
            // console.error(msg);
            Message.error(msg);
        });
    }
    return deferred.promise();
}
Ds.loadList = function (url, params) {
    return _put(url, params, resultRows);

}
Ds.loadByKey = function (url, params) {
    return _put(url, params, resultData);
}

function getmsg(e) {
    var msg = '';
    if (e.hasOwnProperty("message")) {
        msg = e.message;
    } else if (e.hasOwnProperty('data')) {
        msg = e.data.msg;
    } else if (e.hasOwnProperty('code') && e.hasOwnProperty('msg')) {
        if (e.code === '403')
            msg = '操作无对应权限\r\n' + e.msg;
        if (e.code === '207')
            msg = e.msg;
    } else
        msg = e;
    return msg;
}


function _put(url, params, resultType) {
    var deferred = $.Deferred(),
        params;
    put(url, params).then(res => {
        if (res.code == '200') {
            if(res.rows){ deferred.resolve({ data: res.rows, totalCount: res.rows.length } ); }
            else if(res.data){ deferred.resolve(res.data); }
            else { deferred.resolve({ data: res.rows, totalCount: $.trim(res.rows).length} ); }
            // if (resultType === resultRows) {
            //     deferred.resolve(res.rows);
            // } else if (resultType === resultData) {
            //     deferred.resolve(res.data);
            // } else {
            //     deferred.resolve(res.rows);
            // }
        } else {
            var msg = getmsg(res);
            //提示信息
            Message.warning(msg);
            console.warn(msg);
            deferred.resolve([], {
                totalCount: 0
            });
        }
    }).catch(err => {
        deferred.resolve([], {
            totalCount: 0
        });
        var msg = getmsg(err);
        console.error(msg);
        Message.error(msg);
    });
    return deferred.promise();
}



export default Ds;
