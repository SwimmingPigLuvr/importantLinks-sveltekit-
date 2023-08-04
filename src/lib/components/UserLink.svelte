<script lang="ts">
    export let iconURL = 'ha';
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;

  
</script>

<a 
  href="{url}" class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} m-auto rounded-full hover:translate-x-1 hover:translate-y-1 stack text-center bg-secondary flex justify-between items-center border-[0.1rem] border-secondary-focus no-underline relative">
    <img 
      
      src={iconURL} 
      alt={icon} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 rounded-full">
    <span 
      class="{previewMode ? 'text-[1rem]' : 'text-[2rem]'} absolute text-accent-content font-elven text-center">{title}</span>
</a>