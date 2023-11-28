<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET } from "$lib/utils";
	type Todo = {
		text: string
		done: boolean
	}
	type Filters = 'all' | 'active' | 'completed'

	let todos = $state<Todo[]>([])
	let filter = $state<Filters>('all')
	let filteredTodos = $derived(filterTodos())
    let id;
    let infos;
    const searchParams = browser && $page.url.searchParams;

	$effect(() => {
		const savedTodos = localStorage.getItem('todos')
		savedTodos && (todos = JSON.parse(savedTodos))
        id = searchParams.get("url");
        if (id) {
            GET(`/api/evenement/${id}`)
                .then((v) => {
                    infos = v;
                    // console.log(v);
                    // dragDisabled = Device.isMobile || Device.isTablet;
                })
                .catch((e) => console.log(e));
        } else {
            window.location.href = "/";
        }
        console.log(id);
        
	})

	$effect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
	})

	function addTodo(event: KeyboardEvent) {
		if (event.key !== 'Enter') return

		const todoEl = event.target as HTMLInputElement
		const text = todoEl.value
		const done = false

		todos = [...todos, { text, done }]

		todoEl.value = ''
	}

	function editTodo(event: Event) {
		const inputEl = event.target as HTMLInputElement
		const index = +inputEl.dataset.index!
		todos[index].text = inputEl.value
	}

	function toggleTodo(event: Event) {
		const inputEl = event.target as HTMLInputElement
		const index = +inputEl.dataset.index!
		todos[index].done = !todos[index].done
	}

	function setFilter(newFilter: Filters) {
		filter = newFilter
	}

	function filterTodos() {
		switch (filter) {
			case 'all':
				return todos
			case 'active':
				return todos.filter((todo) => !todo.done)
			case 'completed':
				return todos.filter((todo) => todo.done)
		}
	}

	function remaining() {
		return todos.filter((todo) => !todo.done).length
	}

	let date = new Date()

</script>

    
{#await GET(`/api/evenement/lSDWajIUiE`)}
 <p>Chargement</p>   
{:then infos} 
   {#each infos.trajets.split("/") as typeTrajet}
   <h2>{typeTrajet}</h2>
    <input onkeydown={addTodo} placeholder="Add todo" type="text" />
            <div class="todos">
                {#each infos.participants
                    .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom)) as {nom}, i}
                    <div class="todo">
                        <input oninput={editTodo} data-index={i} value={nom} type="text" />
                        <input onchange={toggleTodo} data-index={i} checked={nom} type="checkbox" />
                    </div>
                {/each}
            </div>
    {/each}   
{/await}



<div class="filters">
	<button onclick={() => setFilter('all')}>All</button>
	<button onclick={() => setFilter('active')}>Active</button>
	<button onclick={() => setFilter('completed')}>Completed</button>
</div>

<p>{remaining()} remaining</p>

<style>
	.todos {
        display: flex;
        flex-wrap: wrap;
        margin-block-start: 1rem;
        gap: 1em;
	}

	.todo {
		position: relative;
		transition: opacity 0.3s;
	}

	.completed {
		opacity: 0.4;
	}

	input[type='text'] {
		width: 100%;
		padding: 1rem;
	}

	input[type='checkbox'] {
		position: absolute;
		right: 4%;
		top: 50%;
		translate: 0% -50%;
	}

	.filters {
		margin-block: 1rem;
	}
</style>