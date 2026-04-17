---
title: "Naive UI"
description: "Naive UI is a TypeScript-friendly Vue 3 component library with 80+ components, covering installation, theme customization, and common usage."
icon: "cube"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/frontend/Vue/NaiveUI.md)
</Note>


![TypeScript](https://cdn.bangwu.top/img/TypeScript.png)

# Naive UI

Naive UI isa Vue 3 ComponentLibrary，提供了丰富的Component和完善的 TypeScript supports。

## Features

- 🎨 **customizable theme**：complete theme system
- 📦 **Tree Shaking**：load on demand，small size
- 🔧 **TypeScript**：complete type definitions
- 🌙 **Dark Mode**：内置Dark Theme
- 🎯 **无Dependency**：no third-party UI library dependency
- 📱 **响应式**：mobile-friendly

## Installation

```bash
npm install naive-ui
```

## Usage

### global full import

```javascript
// main.js
import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'

const app = createApp(App)
app.use(naive)
app.mount('#app')
```

### On-demand Import (Recommended)（推荐）

```vue
<script setup>
import { NButton, NSpace, NCard } from 'naive-ui'
</script>

<template>
  <n-space>
    <n-button>Default</n-button>
    <n-button type="primary">Primary</n-button>
  </n-space>
</template>
```

### Auto Import

使用 `unplugin-auto-import` 和 `unplugin-vue-components`：

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
})
```

## Config Provider

```vue
<script setup>
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <app />
  </n-config-provider>
</template>
```

## Theme Configuration

### Custom Theme

```vue
<script setup>
import { NConfigProvider } from 'naive-ui'

const themeOverrides = {
  common: {
    primaryColor: '#FF6B6B',
    primaryColorHover: '#FF8787',
    primaryColorPressed: '#FA5252'
  },
  Button: {
    textColor: '#FF6B6B'
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <app />
  </n-config-provider>
</template>
```

### Dark Mode

```vue
<script setup>
import { ref } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'

const theme = ref(null)

function toggleTheme() {
  theme.value = theme.value ? null : darkTheme
}
</script>

<template>
  <n-config-provider :theme="theme">
    <n-button @click="toggleTheme">切换主题</n-button>
    <app />
  </n-config-provider>
</template>
```

## Common Components

### Button Button

```vue
<template>
  <n-space>
    <n-button>Default</n-button>
    <n-button type="primary">Primary</n-button>
    <n-button type="info">Info</n-button>
    <n-button type="success">Success</n-button>
    <n-button type="warning">Warning</n-button>
    <n-button type="error">Error</n-button>
    
    <!-- 大小 -->
    <n-button size="small">Small</n-button>
    <n-button size="medium">Medium</n-button>
    <n-button size="large">Large</n-button>
    
    <!-- State -->
    <n-button :loading="true">Loading</n-button>
    <n-button disabled>Disabled</n-button>
    
    <!-- Icons -->
    <n-button>
      <template #icon>
        <n-icon><search-icon /></n-icon>
      </template>
      Search
    </n-button>
  </n-space>
</template>
```

### Input Input

```vue
<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <n-space vertical>
    <n-input v-model:value="value" placeholder="请输入" />
    <n-input v-model:value="value" type="password" />
    <n-input v-model:value="value" type="textarea" />
    <n-input-number v-model:value="value" />
  </n-space>
</template>
```

### Select Select

```vue
<script setup>
import { ref } from 'vue'

const value = ref(null)
const options = [
  { label: 'Option1', value: 1 },
  { label: 'Option2', value: 2 },
  { label: 'Option3', value: 3 }
]
</script>

<template>
  <n-select v-model:value="value" :options="options" />
</template>
```

### Table Table

```vue
<script setup>
const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' }
]

const data = [
  { name: 'John', age: 30, address: 'New York' },
  { name: 'Jane', age: 25, address: 'London' }
]
</script>

<template>
  <n-data-table :columns="columns" :data="data" />
</template>
```

### Card Card

```vue
<template>
  <n-card title="Card Title" hoverable>
    <template #header-extra>
      <n-button size="small">Extra</n-button>
    </template>
    
    Card content here
    
    <template #footer>
      Footer content
    </template>
  </n-card>
</template>
```

### Modal Modal

```vue
<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <n-button @click="showModal = true">打开弹窗</n-button>
  
  <n-modal v-model:show="showModal">
    <n-card style="width: 600px" title="Modal" closable @close="showModal = false">
      Modal content
    </n-card>
  </n-modal>
</template>
```

### Form Form

```vue
<script setup>
import { ref } from 'vue'

const formValue = ref({
  name: '',
  age: null,
  email: ''
})

const rules = {
  name: {
    required: true,
    message: '请输入姓名',
    trigger: 'blur'
  },
  age: {
    type: 'number',
    required: true,
    message: '请输入年龄',
    trigger: ['blur', 'change']
  }
}

function handleSubmit(e) {
  e.preventDefault()
  console.log(formValue.value)
}
</script>

<template>
  <n-form :model="formValue" :rules="rules" @submit="handleSubmit">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
    
    <n-form-item label="年龄" path="age">
      <n-input-number v-model:value="formValue.age" />
    </n-form-item>
    
    <n-form-item>
      <n-button attr-type="submit" type="primary">Commit</n-button>
    </n-form-item>
  </n-form>
</template>
```

## Global Notifications

### Message Message

```vue
<script setup>
import { useMessage } from 'naive-ui'

const message = useMessage()

function showMessage() {
  message.success('Operation成功')
  message.error('Operation失败')
  message.warning('Warning信息')
  message.info('提示信息')
}
</script>
```

### Dialog Dialog

```vue
<script setup>
import { useDialog } from 'naive-ui'

const dialog = useDialog()

function showDialog() {
  dialog.warning({
    title: 'Warning',
    content: '你确定吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success('确定了')
    }
  })
}
</script>
```

### Notification Notification

```vue
<script setup>
import { useNotification } from 'naive-ui'

const notification = useNotification()

function showNotification() {
  notification.success({
    title: '成功',
    content: 'Operation成功',
    duration: 2500
  })
}
</script>
```

### Loading Bar Loading Bar

```vue
<script setup>
import { useLoadingBar } from 'naive-ui'

const loadingBar = useLoadingBar()

async function fetchData() {
  loadingBar.start()
  try {
    await api.getData()
    loadingBar.finish()
  } catch (e) {
    loadingBar.error()
  }
}
</script>
```

## Layout Components

### Layout 布局

```vue
<template>
  <n-layout has-sider>
    <n-layout-sider bordered>
      Sider
    </n-layout-sider>
    
    <n-layout>
      <n-layout-header bordered>Header</n-layout-header>
      <n-layout-content>Content</n-layout-content>
      <n-layout-footer bordered>Footer</n-layout-footer>
    </n-layout>
  </n-layout>
</template>
```

### Space Space

```vue
<template>
  <n-space vertical>
    <n-button>Button 1</n-button>
    <n-button>Button 2</n-button>
  </n-space>
  
  <n-space :size="20">
    <n-button>Button 1</n-button>
    <n-button>Button 2</n-button>
  </n-space>
</template>
```

### Grid Grid

```vue
<template>
  <n-grid :cols="12" :x-gap="12" :y-gap="8">
    <n-grid-item :span="6">
      <div>Col-6</div>
    </n-grid-item>
    <n-grid-item :span="6">
      <div>Col-6</div>
    </n-grid-item>
  </n-grid>
</template>
```

## Icons

Naive UI 推荐使用 [xicons](https://www.xicons.org/)：

```bash
npm install @vicons/ionicons5
```

```vue
<script setup>
import { Search } from '@vicons/ionicons5'
</script>

<template>
  <n-icon :size="20">
    <Search />
  </n-icon>
</template>
```

## Best Practices

1. **On-demand Import (Recommended)**：使用Auto ImportPlugin
2. **主题一致性**：统一Configuration主题
3. **全局Configuration**：使用 ConfigProvider
4. **类型supports**：充分利用 TypeScript
5. **Responsive Design**：使用Grid系统
6. **国际化**：Configuration locale

## References

- [Naive UI 官网](https://www.naiveui.com/)
- [GitHub 仓Library](https://github.com/tusen-ai/naive-ui)
- [ComponentDocumentation](https://www.naiveui.com/zh-CN/os-theme/components/button)
- [主题edit器](https://www.naiveui.com/zh-CN/os-theme/docs/customize-theme)