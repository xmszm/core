export { commonDialogMethod } from "./dialog/commonDialog";
export { useCommonDialog } from "./dialog/useCommonDialog";

export { default as DataForm } from "./form/DataForm.vue";
export {
  getAllOptions,
  getOptions,
  setupOptions,
  default as setupInitOptions,
} from "./options/defaultOptions";
export { default as Options } from "./options/Options";
export { default as CommonQuery } from "./query/CommonQuery.vue";

export { createActionColumnJsx, createQRCode } from "./table/opr/useDataColumn";
export { useQRCode } from "./table/opr/useQRCode";

export { default as OprButton } from "./table/opr/useDataColumnButton";

export { default as Pop } from "./table/opr/useDataColumnPop";

export { toArray } from "./utils/array";

export {
  cellectChildenPermission,
  handleParams,
  useApiConfig,
  useAuthPermission,
} from "./utils/auth";

export { ObjectToArray } from "./utils/object";

export { ArrayToObject } from "./utils/array";

export { customUpload, registryUpload, getFileUrl } from "./utils/upload";
export {
  setupConfig,
  getConfig,
  getBaseURL,
  getHasPermission,
  getUploadMethod,
  checkPermission,
  getDialogConfig,
  registerDialogInstance,
  getDialogInstance,
} from "./utils/config";
export {
  createDialog,
  createDialogMethods,
  createDialogOptions,
} from "./utils/dialog";

export { default as DataTable } from "./table/DataTable.vue";

export {
  labelField as globalLabelField,
  valueField as globalValueField,
} from "./enum/options";

export { initRules } from "./dialog/utils/dialog";

export { ellipsis as globalEllipsis } from "./table/utils/ellipsis";

export { initRouteMeta } from "./plugin/vite/initRouteMeta";

export { orderEnum } from "./enum/sort";

// 导出插件和指令
import CorePluginDefault from "./plugin/index";
export { CorePluginDefault as CorePlugin };
export { install } from "./plugin/index";
export { permissionDirective } from "./directives/permission";
export {
  registerDirectives,
  autoRegisterDirectives,
  getGlobalApp,
} from "./directives/auto-register";

export { useList } from "./list/useList";
