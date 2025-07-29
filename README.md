# 喵喵记账 (Meow Money Tracker)

![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js)
![Vant UI](https://img.shields.io/badge/Vant_UI-4-00BFFF?style=for-the-badge)
![Pinia](https://img.shields.io/badge/Pinia-2-FFD700?style=for-the-badge&logo=vue.js)
![ECharts](https://img.shields.io/badge/ECharts-5-B22222?style=for-the-badge&logo=apache-echarts)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)

一款功能完善、移动端优先的个人记账Web App。本项目旨在深入实践通用前端业务逻辑，并全面展示Vue 3全家桶的工程化开发能力。

**[✨ 点击这里，在线访问项目 (Live Demo on Vercel)](https://meow-money-tracker-mu-nine.vercel.app/)**

---

<!-- 
  强烈建议：在这里用 GIF 动图 (推荐使用 ScreenToGif 等工具录制) 
  来展示应用的核心操作（记一笔 -> 查看明细 -> 查看图表 -> 滑动删除），
  这比任何静态截图都更有冲击力！
  
  <p align="center">
    <img src="你的GIF动图链接" width="300px">
  </p>
-->

### ✨ 项目核心功能

-   **账单CRUD:** 完整地实现了记账应用核心的增(`Create`)、查(`Read`)、删(`Delete`)业务逻辑。
-   **数据持久化:** 所有账单数据均通过 **`localStorage`** 进行本地持久化，关闭浏览器后数据不丢失。
-   **动态统计图表:** 集成 **ECharts**，能够对账单数据进行实时的、多维度的聚合分析，并以折线图和饼图的形式进行可视化。
-   **组件化UI:** 使用 **Vant 4** 组件库，构建了包括数据录入表单、滑动删除列表、日期选择器、导航栏在内的高效、美观的移动端用户界面。
-   **流畅的单页面体验:** 使用 **Vue Router** 构建单页面应用(SPA)，页面切换无刷新，体验如原生App般流畅。
-   **全局状态管理:** 利用 **Pinia** 对所有账单记录进行集中、响应式的状态管理，保证了跨组件数据的一致性。

### 🚀 技术栈

-   **核心框架:** Vue 3 (Composition API)
-   **状态管理:** Pinia
-   **路由管理:** Vue Router 4
-   **UI 库:** Vant 4
-   **数据可视化:** ECharts 5
-   **数据持久化:** Web Storage API (localStorage)
-   **工程化与工具:** Vue CLI, ESLint, Git
-   **部署:** Vercel (CI/CD 自动部署)

### 💡 项目立意与个人成长

在完成了多个GIS领域的专业项目后，我希望通过“喵喵记账”这个项目，来证明我具备**跨领域的通用前端开发能力**。这个项目让我100%聚焦于前端的核心业务逻辑，如复杂的表单处理、精细化的状态管理、以及数据驱动的图表可视化。

通过这个项目，我不仅深化了对Vue全家桶的理解，更重要的是，将在GIS项目中积累的“数据处理”和“工程化”思维，成功地应用到了一个全新的业务场景中。

### 🔧 如何在本地运行

1.  **克隆本仓库**
    ```bash
    git clone https://github.com/TiAmo1029/meow-money-tracker.git
    cd meow-money-tracker
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **启动本地开发服务器**
    ```bash
    npm run serve
    ```
    应用将在 `http://localhost:8080` (或类似端口) 上运行。

---

### 📄 License

[MIT](https://opensource.org/licenses/MIT) © 2025 秦亚会
