<script lang="ts">
    export let iconURL = 'ha';
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;

  
</script>

<a 
  href="{url}" class="{previewMode ? 'md:max-w-[94%] bg-white rounded-xl max-h-[5%]' : 'md:max-w-md'} m-auto rounded-full hover:translate-x-1 hover:translate-y-1 stack w-full max-w-[94%] text-center bg-secondary flex justify-between items-center p-[0.4rem] border-[0.1rem] border-secondary-focus no-underline relative">
    <img 
      
      src={iconURL} 
      alt={icon} 
      class="{previewMode ? '' : 'w-12 h-12 rounded-full'} ">
    <span 
      class="text-[2rem] absolute text-accent-content font-elven text-center">{title}</span>
</a>