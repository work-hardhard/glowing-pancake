<template>
  <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item> -->

  <template v-for="(item, index) in props.menuData">
    <!-- 没有子菜单的情况 -->
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`"
    >
      <!-- <el-icon><setting /></el-icon>
      <span>Navigator Four</span> -->
      <el-icon size="20">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <!-- 有子菜单的情况 -->
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
  <!-- 一级结构 -->
</template>

<script setup>
import { nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store/index.js";

const props = defineProps(["menuData", "index"]);
// console.log(props.index, "props");

//创建router实例
const router = useRouter();

const asideStore = useStore();
//点击菜单
const handleClick = (item, active) => {
  asideStore.addMenu(item.meta);
  console.log(item, "item");
  router.push(item.meta.path);

  asideStore.updateMenuActive(active);
  console.log("传递的active:", active);
};
</script>

<style scoped>
</style>