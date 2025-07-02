<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { Button } from '@/components/ui/button';

    const colorMode = useColorMode();
    const isDarkMode = computed(() => colorMode.value === 'dark');

    import {
        NavigationMenu,
        NavigationMenuContent,
        NavigationMenuItem,
        NavigationMenuLink,
        NavigationMenuList,
        NavigationMenuTrigger,
        navigationMenuTriggerStyle
    } from '@/components/ui/navigation-menu';

    const handleChange = (value: boolean) => {
        colorMode.preference = value ? 'dark' : 'light';
    };

    const components: { title: string; href: string; description: string }[] = [
        {
            title: 'Vanilla Item Tags',
            href: '/vanilla-item-tags',
            description: ''
        },
        {
            title: 'Vanilla Block Tags',
            href: '/vanilla-block-tags',
            description: ''
        },
        {
            title: 'Implemented Features',
            href: '/implemented-features',
            description: ''
        }
    ];
</script>

<template>
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="flex justify-between items-center mb-4">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/"
                            :class="navigationMenuTriggerStyle()">
                            Home
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>More</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul
                                class="grid w-[200px] gap-3 p-4 md:w-[250px] md:grid-cols-2 lg:w-[300px]">
                                <li
                                    v-for="component in components"
                                    :key="component.title">
                                    <NavigationMenuLink as-child>
                                        <a
                                            :href="component.href"
                                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                            <div
                                                class="text-sm font-medium leading-none">
                                                {{ component.title }}
                                            </div>
                                            <p
                                                class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                {{ component.description }}
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div class="flex items-center space-x-2 ml-auto">
                <!-- Your two buttons go here -->
                <NuxtLink to="https://smokeystack.dev" target="_blank">
                    <Button variant="outline">
                        <Icon
                            icon="radix-icons:globe"
                            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Icon
                            icon="radix-icons:globe"
                            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </NuxtLink>
                <Button variant="outline" @click="handleChange(!isDarkMode)">
                    <Icon
                        icon="radix-icons:moon"
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Icon
                        icon="radix-icons:sun"
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </div>
        </div>
        <NuxtPage />
    </div>
</template>
