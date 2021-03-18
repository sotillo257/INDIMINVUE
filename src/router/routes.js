
const routes = [
  {
  path: '/', component: () => import('pages/Login.vue') 
    },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'Ciudadanos', component: () => import('pages/Index.vue') },
      { path: 'Tareas', component: () => import('pages/Tareas.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
