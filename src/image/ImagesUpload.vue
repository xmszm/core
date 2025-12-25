<script setup lang="jsx">
// import { FilePath } from '@/api/upload'
import dayjs from "dayjs";
import { ref, watch } from "vue";
import { customUpload, getFileUrl } from "../utils/upload";
import { NUpload, NSpace } from "naive-ui";
const props = defineProps({
  value: {
    type: [Array, String],
    default: () => [],
  },
  max: {
    type: Number,
    default: () => 5,
  },
  lib: {
    type: Boolean,
    default: () => true,
  },
  clip: {
    type: Boolean,
    default: () => false,
  },
  read: {
    type: Boolean,
    default: () => false,
  },
  size: {
    type: Number,
    default: () => 100,
  },
  width: {
    type: Number,
    default: () => 100,
  },
  height: {
    type: Number,
    default: () => 100,
  },
  mode: {
    type: String,
    default: () => "fill",
  },
  formData: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["update:value", "complete"]);

const FilePath = "/admin/file";

const _value = ref([]);
watch(
  () => props.value,
  (value) => {
    console.log("props.value", value);
    _value.value =
      props.max === 1
        ? value
          ? typeof value !== "string"
            ? value?.length
              ? [
                  {
                    id: dayjs().valueOf(),
                    name: `img${dayjs().valueOf()}`,
                    url: getFileUrl(value[0]),
                    thumbnailUrl: getFileUrl(value[0]),
                    fullPath: value[0],
                    status: "finished",
                  },
                ]
              : []
            : [
                {
                  id: dayjs().valueOf(),
                  name: `img${dayjs().valueOf()}`,
                  url: getFileUrl(value),
                  fullPath: value,
                  thumbnailUrl: getFileUrl(value),
                  status: "finished",
                },
              ]
          : []
        : value?.map((v, i) => ({
            id: dayjs().valueOf() + i,
            name: `img${dayjs().valueOf()}`,
            url: getFileUrl(v),
            fullPath: v,
            thumbnailUrl: getFileUrl(v),
            status: "finished",
          })) || [];

    console.log("1", _value.value);
  },
  { immediate: true }
);
function customRequestMethod(...arg) {
  sendImgRequest(arg[0]);
}

async function sendImgRequest({ file, onFinish, onError, onProgress }, fn) {
  const formData = new FormData();
  if (file.status === "pending") {
    formData.append("file", file.file);
    if (props.formData && Object.keys(props.formData).length) {
      Object.keys(props.formData).forEach((key) => {
        formData.append(key, props.formData[key]);
      });
    }
    customUpload({
      url: FilePath,
      data: formData,
      method: "post",
      onUploadProgress: ({ percent }) => onProgress({ percent }),
    })
      .then((res) => {
        const { url } = res.data;
        file.url = getFileUrl(url);
        file.fullPath = url;
        file.thumbnailUrl = getFileUrl(url);
        // onError()
        onFinish();
        onSubmit();
      })
      .catch(() => {
        file = null;
        onError();
      })
      .finally(() => {
        fn && fn();
      });
  }
}

function onSubmit() {
  console.log("onSubmit", _value.value);

  const arr = _value.value.reduce((o, n) => {
    if (n.status === "finished" && n?.fullPath) {
      o.push(n.fullPath);
    }
    return o;
  }, []);
  if (props.max === 1 && arr.length === 1) {
    emit("update:value", arr[0]);
  } else if (arr.length) {
    emit("update:value", arr);
  } else {
    emit("update:value", props.max === 1 ? null : []);
  }
}
</script>

<template>
  <NSpace align="end" :wrap-item="false">
    <NUpload
      v-model:file-list="_value"
      accept=".jpeg,.jpg,.png"
      list-type="image-card"
      :custom-request="customRequestMethod"
      :max="
        props.read
          ? Array.isArray(props.value)
            ? props.value.length
            : 1
          : props.max
      "
      :show-retry-button="false"
      :show-remove-button="!props.read"
      class="upload-box"
      :style="{
        ...(props.size
          ? { '--image-w': `${props.size}px`, '--image-h': `${props.size}px` }
          : {
              '--image-w': `${props.width}px`,
              '--image-h': `${props.height}px`,
            }),
        '--image-mode': props.mode,
      }"
      @finish="
        () => {
          onSubmit();
          emit('complete');
        }
      "
      @remove="
        (_, index) => {
          _value.splice(index, 1);
          onSubmit();

          return false;
        }
      "
    />
  </NSpace>
</template>

<style scoped lang="less">
.upload-box {
  width: auto;
  :deep(.n-upload-file-list.n-upload-file-list--grid) {
    display: flex;
    flex-wrap: wrap;
  }
  :deep(.n-upload-file.n-upload-file--image-card-type) {
    width: var(--image-w);
    height: var(--image-h);

    & .n-image img {
      object-fit: var(--image-mode) !important;
    }
  }
  :deep(.n-upload-trigger--image-card) {
    width: var(--image-w);
    height: var(--image-h);
  }

  :deep(.n-upload-file--error-status:not(:hover)),
  :deep(.n-upload-file--info-status:not(:hover)) {
    .n-upload-file-info {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        display: block;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }
  :deep(.n-upload-file--error-status:not(:hover)) {
    &::after {
      font-size: 12px;
      white-space: nowrap;
      content: "上传失败~";
      position: absolute;
      color: rgba(255, 255, 255, 0.75);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      display: block;
    }
  }
  :deep(.n-upload-file--info-status:not(:hover)) {
    &::after {
      font-size: 12px;
      white-space: nowrap;
      content: "加载中~";
      position: absolute;
      color: rgba(255, 255, 255, 0.75);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      display: block;
    }
  }
}
</style>
